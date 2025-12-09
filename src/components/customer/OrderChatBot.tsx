import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Loader2, ShoppingCart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { llmService, LLMMessage, ParsedOrderItem } from '@/services/llm.service';
import { MenuItem } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { Streamdown } from 'streamdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  parsedItems?: ParsedOrderItem[];
  isStreaming?: boolean;
}

interface OrderChatBotProps {
  menuItems: MenuItem[];
  onAddToCart: (itemId: string, quantity: number) => void;
  onCreateOrder?: () => void;
  className?: string;
}

export default function OrderChatBot({ menuItems, onAddToCart, onCreateOrder, className }: OrderChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<LLMMessage[]>([]);
  const [itemsAddedToCart, setItemsAddedToCart] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "👋 Hi! I'm your AI ordering assistant. Just tell me what you'd like to order in natural language!\n\n**How it works:**\n1. Tell me your order (e.g., \"I want 2 pizzas and 1 daal tadka\")\n2. I'll parse your order and show you what I understood\n3. Click \"Add to Cart\" to add items\n4. Click \"Proceed to Checkout\" when ready\n\n**Try saying:**\n- \"I want 2 Margherita Pizza and 1 Daal Tadka\"\n- \"Get me 4 rotis and 1 paneer tikka\"\n- \"Order 1 large pizza\"",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    const availableItems = menuItems
      .filter((item) => item.is_available)
      .map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      }));

    await llmService.parseOrderFromNaturalLanguage(
      inputValue,
      availableItems,
      conversationHistory,
      (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      },
      (fullText, parsedItems) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullText, parsedItems, isStreaming: false }
              : msg
          )
        );

        setConversationHistory((prev) => [
          ...prev,
          { role: 'user', parts: [{ text: inputValue }] },
          { role: 'model', parts: [{ text: fullText }] },
        ]);

        setIsProcessing(false);
      },
      (error) => {
        console.error('LLM error:', error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: '❌ Sorry, I encountered an error processing your request. Please try again.',
                  isStreaming: false,
                }
              : msg
          )
        );
        setIsProcessing(false);
        toast({
          title: 'Error',
          description: 'Failed to process your order. Please try again.',
          variant: 'destructive',
        });
      }
    );
  };

  const handleAddParsedItemsToCart = (parsedItems: ParsedOrderItem[]) => {
    if (!parsedItems || parsedItems.length === 0) {
      toast({
        title: 'No items to add',
        description: 'No valid items were found in your order.',
        variant: 'destructive',
      });
      return;
    }

    let addedCount = 0;
    let notFoundItems: string[] = [];

    parsedItems.forEach((parsedItem) => {
      const menuItem = menuItems.find(
        (item) =>
          item.name.toLowerCase() === parsedItem.itemName.toLowerCase() &&
          item.is_available
      );

      if (menuItem) {
        onAddToCart(menuItem.id, parsedItem.quantity);
        addedCount++;
      } else {
        notFoundItems.push(parsedItem.itemName);
      }
    });

    if (addedCount > 0) {
      setItemsAddedToCart(true);
      toast({
        title: '✅ Added to cart!',
        description: `${addedCount} item(s) added to your cart. Click "Proceed to Checkout" when ready!`,
      });
    }

    if (notFoundItems.length > 0) {
      toast({
        title: '⚠️ Some items not found',
        description: `Could not find: ${notFoundItems.join(', ')}`,
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          'transition-all duration-300 hover:scale-110',
          className
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        'fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] z-50',
        'shadow-2xl border-2 flex flex-col',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <CardTitle className="text-lg font-semibold">Order Assistant</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 hover:bg-primary-foreground/20 text-primary-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-lg px-4 py-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <Streamdown>{message.content}</Streamdown>
                    {message.isStreaming && (
                      <Loader2 className="h-4 w-4 animate-spin inline-block ml-2" />
                    )}
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}

                {message.parsedItems && message.parsedItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">Parsed Order:</span>
                      <Button
                        size="sm"
                        onClick={() => handleAddParsedItemsToCart(message.parsedItems!)}
                        className="h-7 text-xs gap-1"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Add to Cart
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {message.parsedItems.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item.quantity}x {item.itemName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-background">
          {itemsAddedToCart && onCreateOrder && (
            <div className="mb-3">
              <Button
                onClick={() => {
                  onCreateOrder();
                  setItemsAddedToCart(false);
                  toast({
                    title: '🎉 Proceeding to checkout',
                    description: 'Taking you to checkout page...',
                  });
                }}
                className="w-full"
                size="lg"
              >
                <Check className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your order here..."
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isProcessing || !inputValue.trim()}
              size="icon"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Try: "I want 2 pizzas and 1 daal tadka"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
