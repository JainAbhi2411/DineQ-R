# NLP Chatbot for Natural Language Ordering

## Overview

This feature adds an AI-powered chatbot that allows customers to place orders using natural language. Instead of manually browsing the menu and clicking "Add to Cart" for each item, customers can simply type what they want in conversational language, and the chatbot will automatically parse their order and add items to the cart.

## Key Features

### 🤖 Natural Language Processing
- Powered by Google's Gemini 2.5 Flash LLM
- Understands conversational order requests
- Flexible item name matching (handles variations and typos)
- Extracts quantities automatically

### 💬 Interactive Chat Interface
- Floating chat button in bottom-right corner
- Clean, modern chat UI with message history
- Real-time streaming responses
- Loading indicators and animations

### 🛒 Smart Cart Integration
- Automatically adds parsed items to cart
- Shows parsed order summary before adding
- One-click "Add to Cart" button for parsed items
- Handles items not found in menu gracefully

### ✨ User Experience
- Welcome message with example orders
- Markdown-formatted responses
- Error handling with user-friendly messages
- Mobile-responsive design

## How It Works

### 1. Customer Opens Chatbot
- Click the floating message icon in the bottom-right corner
- Chat window opens with a welcome message

### 2. Customer Types Order
Examples of natural language orders:
- "I want 2 Margherita Pizza and 1 Daal Tadka"
- "Get me 4 rotis and 1 paneer tikka"
- "Order 1 large pizza with extra cheese"
- "I'd like to order 3 butter naan, 2 dal makhani, and 1 chicken biryani"

### 3. AI Processes Order
- LLM receives the order text along with available menu items
- Matches items to the menu (case-insensitive, handles variations)
- Extracts quantities for each item
- Generates a friendly confirmation message

### 4. Customer Reviews & Adds to Cart
- Chatbot displays a friendly confirmation
- Shows parsed items with quantities as badges
- Customer clicks "Add to Cart" button
- Items are automatically added to the shopping cart

### 5. Proceed to Checkout
- Customer can continue ordering or proceed to checkout
- Cart is updated in real-time

## Technical Architecture

### Components

#### 1. LLM Service (`src/services/llm.service.ts`)
- Handles API communication with Gemini LLM
- Implements streaming response parsing
- Extracts structured order data from LLM responses
- Provides reusable methods for order parsing and general chat

**Key Methods:**
- `parseOrderFromNaturalLanguage()` - Main method for order processing
- `extractOrderItems()` - Parses JSON from LLM response
- `streamLLM()` - Handles streaming API calls

#### 2. OrderChatBot Component (`src/components/customer/OrderChatBot.tsx`)
- React component for the chat interface
- Manages conversation state and history
- Displays messages with markdown formatting
- Handles user input and cart integration

**Props:**
- `menuItems: MenuItem[]` - Available menu items for context
- `onAddToCart: (itemId: string, quantity: number) => void` - Callback to add items to cart

#### 3. Integration in MenuBrowsing Page
- Chatbot added as floating component
- Receives menu items and cart management functions
- Seamlessly integrates with existing cart system

### Data Flow

```
User Input
    ↓
OrderChatBot Component
    ↓
LLM Service (with menu context)
    ↓
Gemini API (streaming)
    ↓
Parse JSON response
    ↓
Extract items & quantities
    ↓
Display parsed order
    ↓
User clicks "Add to Cart"
    ↓
Cart updated via onAddToCart callback
    ↓
Toast notification shown
```

### LLM Prompt Engineering

The system uses a carefully crafted prompt that:
1. Provides the complete menu with prices
2. Instructs the LLM to match items flexibly
3. Requests a structured JSON response
4. Handles edge cases (items not found, ambiguous requests)

**Example Prompt Structure:**
```
You are a helpful restaurant ordering assistant.

Available menu items:
- Margherita Pizza (₹299)
- Daal Tadka (₹149)
- Roti (₹20)
...

Your task:
1. Understand the customer's order
2. Match items to the menu
3. Extract quantities
4. Respond with confirmation and JSON
```

**Example LLM Response:**
```
Great! I can help you with that order. You want:
- 2x Margherita Pizza
- 1x Daal Tadka

Let me prepare that for you!

```json
{
  "items": [
    {"itemName": "Margherita Pizza", "quantity": 2},
    {"itemName": "Daal Tadka", "quantity": 1}
  ]
}
```
```

## API Integration

### Endpoint
```
POST https://api-integrations.appmedo.com/{APP_ID}/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse
```

### Headers
```json
{
  "Content-Type": "application/json",
  "X-App-Id": "{APP_ID}"
}
```

### Request Body
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [{"text": "System prompt with menu context"}]
    },
    {
      "role": "model",
      "parts": [{"text": "Acknowledgment"}]
    },
    {
      "role": "user",
      "parts": [{"text": "I want 2 pizzas and 1 daal tadka"}]
    }
  ]
}
```

### Response (Server-Sent Events)
```
data: {"candidates":[{"content":{"role":"model","parts":[{"text":"Great! I can help..."}]},"finishReason":"STOP"}]}

data: {"candidates":[{"content":{"role":"model","parts":[{"text":" with that order..."}]},"finishReason":"STOP"}]}
```

## Error Handling

### 1. API Errors
- Network failures
- Timeout errors
- Invalid responses
- **Handling:** Display error message in chat, allow retry

### 2. Parsing Errors
- No JSON block in response
- Invalid JSON format
- Missing required fields
- **Handling:** Return empty items array, show friendly message

### 3. Menu Matching Errors
- Item not found in menu
- Item not available
- **Handling:** Show which items couldn't be added, add available items

### 4. User Input Errors
- Empty messages
- Non-food related queries
- **Handling:** LLM responds appropriately, no items parsed

## User Interface

### Floating Button
- **Position:** Fixed bottom-right corner
- **Style:** Primary color, circular, with message icon
- **Behavior:** Opens chat window on click
- **Animation:** Hover scale effect

### Chat Window
- **Size:** 400px wide, 600px tall (responsive on mobile)
- **Layout:** Header, scrollable messages, input footer
- **Header:** Title, close button
- **Messages:** User (right-aligned, primary color), Assistant (left-aligned, muted)
- **Footer:** Input field, send button, example text

### Message Display
- **User Messages:** Plain text, right-aligned
- **Assistant Messages:** Markdown-formatted, left-aligned
- **Parsed Order:** Badge list with "Add to Cart" button
- **Loading:** Spinner animation during streaming

## Testing Guide

### Test Cases

#### 1. Basic Order
**Input:** "I want 2 Margherita Pizza"
**Expected:** 
- LLM confirms order
- Shows parsed: 2x Margherita Pizza
- Adds 2 pizzas to cart on button click

#### 2. Multiple Items
**Input:** "Get me 1 daal tadka, 4 roti, and 1 margherita pizza"
**Expected:**
- LLM confirms all items
- Shows parsed: 1x Daal Tadka, 4x Roti, 1x Margherita Pizza
- Adds all items to cart

#### 3. Item Variations
**Input:** "I want dal tadka" (without double 'a')
**Expected:**
- LLM matches to "Daal Tadka"
- Successfully adds to cart

#### 4. Item Not Found
**Input:** "I want 1 burger"
**Expected:**
- LLM mentions burger is not available
- Shows empty parsed items or excludes burger
- Toast notification about item not found

#### 5. Ambiguous Request
**Input:** "Get me some food"
**Expected:**
- LLM asks for clarification
- No items parsed
- Conversation continues

#### 6. Conversation Flow
**Input 1:** "What pizzas do you have?"
**Input 2:** "I'll take 2 of the margherita"
**Expected:**
- LLM lists available pizzas
- Then processes the order
- Maintains conversation context

### Manual Testing Steps

1. **Open Menu Browsing Page**
   - Navigate to any restaurant's menu
   - Verify floating chat button appears

2. **Open Chatbot**
   - Click the message icon
   - Verify chat window opens
   - Check welcome message displays

3. **Place Simple Order**
   - Type: "I want 2 pizzas"
   - Verify streaming response
   - Check parsed items display
   - Click "Add to Cart"
   - Verify cart updates
   - Check toast notification

4. **Place Complex Order**
   - Type: "Get me 1 daal tadka, 4 roti, 1 paneer tikka, and 2 naan"
   - Verify all items parsed correctly
   - Add to cart and verify

5. **Test Error Cases**
   - Type: "I want a burger" (not in menu)
   - Verify error handling
   - Type empty message
   - Verify send button disabled

6. **Test Mobile Responsiveness**
   - Open on mobile device
   - Verify chat window fits screen
   - Test scrolling and input

## Performance Considerations

### 1. Streaming Responses
- First token may take up to 30 seconds
- Subsequent tokens stream quickly
- User sees response building in real-time

### 2. Menu Context
- Only available items sent to LLM
- Menu filtered before API call
- Reduces token usage

### 3. Conversation History
- Maintains context for follow-up questions
- Limited to current session
- Cleared when chat is closed

### 4. Cart Updates
- Optimistic UI updates
- Immediate feedback to user
- No page reload required

## Future Enhancements

### Potential Improvements
1. **Voice Input:** Add speech-to-text for hands-free ordering
2. **Image Recognition:** Upload food photos to order
3. **Recommendations:** LLM suggests popular items or combos
4. **Multi-language:** Support orders in multiple languages
5. **Order History:** "Order the same as last time"
6. **Dietary Preferences:** Remember and suggest based on preferences
7. **Portion Sizes:** Handle "large", "small", "half" in natural language
8. **Customizations:** Parse special requests like "extra cheese", "no onions"

## Troubleshooting

### Issue: Chatbot button not appearing
**Solution:** Check that you're on the MenuBrowsing page with a valid restaurant ID

### Issue: LLM not responding
**Solution:** 
- Check network connection
- Verify APP_ID environment variable is set
- Check browser console for API errors

### Issue: Items not being added to cart
**Solution:**
- Verify item names match menu exactly
- Check that items are marked as available
- Look for console errors in cart integration

### Issue: Slow responses
**Solution:**
- First token can take up to 30 seconds (normal)
- Check network speed
- Verify API endpoint is accessible

### Issue: Incorrect item matching
**Solution:**
- LLM uses fuzzy matching
- Provide more specific item names
- Check that menu items have clear, unique names

## Files Modified/Created

### Created Files
1. `src/services/llm.service.ts` - LLM API integration service
2. `src/components/customer/OrderChatBot.tsx` - Chat UI component
3. `NLP_CHATBOT_FEATURE.md` - This documentation

### Modified Files
1. `src/pages/customer/MenuBrowsing.tsx` - Added chatbot integration

## Dependencies

- `eventsource-parser` (^3.0.6) - Parse SSE streams
- `streamdown` (^1.4.0) - Render markdown with streaming support
- Existing: `react`, `lucide-react`, `shadcn/ui`

## Conclusion

The NLP Chatbot feature significantly enhances the user experience by allowing natural language ordering. It leverages cutting-edge AI technology to understand customer intent and streamline the ordering process. The implementation is robust, user-friendly, and seamlessly integrates with the existing cart system.

**Key Benefits:**
- ⚡ Faster ordering process
- 🎯 Intuitive, conversational interface
- 🤖 AI-powered understanding
- 📱 Mobile-friendly design
- 🛒 Seamless cart integration
