import { createParser, EventSourceMessage, ParserCallbacks } from 'eventsource-parser';

const APP_ID = import.meta.env.VITE_APP_ID;
const LLM_API_URL = `https://api-integrations.appmedo.com/${APP_ID}/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse`;

export interface LLMMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface LLMRequest {
  contents: LLMMessage[];
}

export interface LLMResponse {
  candidates: Array<{
    content: {
      role: string;
      parts: Array<{ text: string }>;
    };
    finishReason: string;
    index: number;
  }>;
}

export interface ParsedOrderItem {
  itemName: string;
  quantity: number;
}

export class LLMService {
  private async streamLLM(
    request: LLMRequest,
    onChunk: (text: string) => void,
    onComplete: (fullText: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(LLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Id': APP_ID,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let fullText = '';

      const parser = createParser({
        onEvent: (event: EventSourceMessage) => {
          try {
            const data = JSON.parse(event.data) as LLMResponse;
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            if (text) {
              fullText += text;
              onChunk(text);
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e);
          }
        },
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        parser.feed(chunk);
      }

      onComplete(fullText);
    } catch (error) {
      console.error('LLM streaming error:', error);
      onError(error as Error);
    }
  }

  async parseOrderFromNaturalLanguage(
    userInput: string,
    availableMenuItems: Array<{ id: string; name: string; price: number }>,
    conversationHistory: LLMMessage[] = [],
    onChunk: (text: string) => void,
    onComplete: (fullText: string, parsedItems: ParsedOrderItem[]) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const menuContext = availableMenuItems
      .map((item) => `- ${item.name} (₹${item.price})`)
      .join('\n');

    const systemPrompt = `You are a helpful restaurant ordering assistant. The customer wants to order food using natural language.

Available menu items:
${menuContext}

Your task:
1. Understand the customer's order request
2. Match items to the available menu (be flexible with names, e.g., "margherita" matches "Margherita Pizza")
3. Extract quantities for each item
4. Respond in a friendly, conversational way confirming what you understood
5. At the end of your response, include a JSON block with the parsed order in this exact format:

\`\`\`json
{
  "items": [
    {"itemName": "exact menu item name", "quantity": number}
  ]
}
\`\`\`

Important:
- Use the EXACT item names from the menu list above
- If an item is not found, politely mention it's not available
- Be case-insensitive when matching items
- Handle variations (e.g., "roti" = "Roti", "dal tadka" = "Daal Tadka")
- Always include the JSON block even if no valid items were found (use empty array)`;

    const messages: LLMMessage[] = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I will help parse food orders and match them to the available menu items, then provide a JSON response with the parsed items.' }],
      },
      ...conversationHistory,
      {
        role: 'user',
        parts: [{ text: userInput }],
      },
    ];

    await this.streamLLM(
      { contents: messages },
      onChunk,
      (fullText) => {
        const parsedItems = this.extractOrderItems(fullText);
        onComplete(fullText, parsedItems);
      },
      onError
    );
  }

  private extractOrderItems(llmResponse: string): ParsedOrderItem[] {
    try {
      const jsonMatch = llmResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (!jsonMatch) {
        console.warn('No JSON block found in LLM response');
        return [];
      }

      const jsonStr = jsonMatch[1];
      const parsed = JSON.parse(jsonStr);
      
      if (parsed.items && Array.isArray(parsed.items)) {
        return parsed.items.map((item: any) => ({
          itemName: item.itemName,
          quantity: Number(item.quantity) || 1,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error extracting order items from LLM response:', error);
      return [];
    }
  }

  async chat(
    userMessage: string,
    conversationHistory: LLMMessage[],
    onChunk: (text: string) => void,
    onComplete: (fullText: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const messages: LLMMessage[] = [
      ...conversationHistory,
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];

    await this.streamLLM(
      { contents: messages },
      onChunk,
      onComplete,
      onError
    );
  }
}

export const llmService = new LLMService();
