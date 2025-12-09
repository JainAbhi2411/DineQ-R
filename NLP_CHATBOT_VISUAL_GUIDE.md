# NLP Chatbot Visual Guide

## User Journey

### Step 1: Floating Chat Button
```
┌─────────────────────────────────────────┐
│  Restaurant Menu                        │
│                                         │
│  [Menu Items Grid]                      │
│                                         │
│                                         │
│                              ┌────┐     │
│                              │ 💬 │ ←── Floating button
│                              └────┘     │
└─────────────────────────────────────────┘
```

### Step 2: Chat Window Opens
```
┌─────────────────────────────────────────┐
│  Restaurant Menu                        │
│                                         │
│  [Menu Items]          ┌──────────────┐ │
│                        │ Order Assist │ │
│                        │──────────────│ │
│                        │              │ │
│                        │ 👋 Hi! I'm   │ │
│                        │ your ordering│ │
│                        │ assistant... │ │
│                        │              │ │
│                        │──────────────│ │
│                        │ Type here... │ │
│                        └──────────────┘ │
└─────────────────────────────────────────┘
```

### Step 3: Customer Types Order
```
┌──────────────────────────────────────┐
│ Order Assistant                    ✕ │
├──────────────────────────────────────┤
│                                      │
│  👋 Hi! I'm your ordering assistant  │
│  You can tell me what you'd like...  │
│                                      │
│                  ┌─────────────────┐ │
│                  │ I want 2 pizzas │ │
│                  │ and 1 daal tadka│ │
│                  └─────────────────┘ │
│                                      │
├──────────────────────────────────────┤
│ Type your order here...          [→] │
└──────────────────────────────────────┘
```

### Step 4: AI Responds with Streaming
```
┌──────────────────────────────────────┐
│ Order Assistant                    ✕ │
├──────────────────────────────────────┤
│                                      │
│                  ┌─────────────────┐ │
│                  │ I want 2 pizzas │ │
│                  │ and 1 daal tadka│ │
│                  └─────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Great! I can help you with     │  │
│  │ that order. You want:          │  │
│  │ • 2x Margherita Pizza          │  │
│  │ • 1x Daal Tadka                │  │
│  │                                │  │
│  │ ⏳ (streaming...)              │  │
│  └────────────────────────────────┘  │
│                                      │
├──────────────────────────────────────┤
│ Type your order here...          [→] │
└──────────────────────────────────────┘
```

### Step 5: Parsed Order Display
```
┌──────────────────────────────────────┐
│ Order Assistant                    ✕ │
├──────────────────────────────────────┤
│                                      │
│                  ┌─────────────────┐ │
│                  │ I want 2 pizzas │ │
│                  │ and 1 daal tadka│ │
│                  └─────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Great! I can help you with     │  │
│  │ that order. You want:          │  │
│  │ • 2x Margherita Pizza          │  │
│  │ • 1x Daal Tadka                │  │
│  │                                │  │
│  │ ─────────────────────────────  │  │
│  │ Parsed Order:  [🛒 Add to Cart]│  │
│  │ [2x Margherita Pizza]          │  │
│  │ [1x Daal Tadka]                │  │
│  └────────────────────────────────┘  │
│                                      │
├──────────────────────────────────────┤
│ Type your order here...          [→] │
└──────────────────────────────────────┘
```

### Step 6: Items Added to Cart
```
┌─────────────────────────────────────────┐
│  Restaurant Menu                        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ✅ Added to cart!               │   │
│  │ 2 item(s) added to your cart.   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Menu Items]          ┌──────────────┐ │
│                        │ Order Assist │ │
│                        │──────────────│ │
│                        │ [Chat msgs]  │ │
│                        │              │ │
│  [🛒 Cart (3)]         │──────────────│ │
│                        │ Type here... │ │
│                        └──────────────┘ │
└─────────────────────────────────────────┘
```

## UI Components Breakdown

### Floating Button
```
┌────────────┐
│            │
│     💬     │  ← Primary color background
│            │  ← Circular shape
└────────────┘  ← Shadow effect
                ← Hover: scale up
```

### Chat Window
```
┌─────────────────────────────────────┐
│ 💬 Order Assistant              [✕] │ ← Header (Primary color)
├─────────────────────────────────────┤
│                                     │
│  [Message 1]                        │ ← Scrollable area
│                                     │
│                  [Message 2]        │
│                                     │
│  [Message 3]                        │
│                                     │
├─────────────────────────────────────┤
│ [Input field]                   [→] │ ← Footer
│ Try: "I want 2 pizzas..."           │
└─────────────────────────────────────┘
```

### Message Bubbles

**User Message (Right-aligned):**
```
                    ┌─────────────────┐
                    │ I want 2 pizzas │ ← Primary color bg
                    │ and 1 daal tadka│ ← White text
                    └─────────────────┘
```

**Assistant Message (Left-aligned):**
```
┌────────────────────────────────┐
│ Great! I can help you with     │ ← Muted bg
│ that order. You want:          │ ← Dark text
│ • 2x Margherita Pizza          │ ← Markdown formatted
│ • 1x Daal Tadka                │
│                                │
│ ─────────────────────────────  │
│ Parsed Order:  [🛒 Add to Cart]│ ← Action button
│ [2x Margherita Pizza]          │ ← Badge
│ [1x Daal Tadka]                │ ← Badge
└────────────────────────────────┘
```

### Loading State
```
┌────────────────────────────────┐
│ Processing your order...       │
│ ⏳ (spinner animation)         │
└────────────────────────────────┘
```

## Example Conversations

### Example 1: Simple Order
```
User: I want 2 pizzas

Bot: Great! I can help you with that. You want:
     • 2x Margherita Pizza
     
     Parsed Order: [🛒 Add to Cart]
     [2x Margherita Pizza]
```

### Example 2: Multiple Items
```
User: Get me 1 daal tadka, 4 roti, and 1 margherita pizza

Bot: Perfect! I've got your order:
     • 1x Daal Tadka
     • 4x Roti
     • 1x Margherita Pizza
     
     Parsed Order: [🛒 Add to Cart]
     [1x Daal Tadka] [4x Roti] [1x Margherita Pizza]
```

### Example 3: Item Not Found
```
User: I want 1 burger

Bot: I'm sorry, but I don't see "burger" on our menu.
     Would you like to try something else? We have:
     • Margherita Pizza
     • Daal Tadka
     • Paneer Tikka
     ...
     
     Parsed Order: (empty)
```

### Example 4: Conversational Flow
```
User: What pizzas do you have?

Bot: We have several delicious pizzas:
     • Margherita Pizza (₹299)
     • Pepperoni Pizza (₹349)
     • Veggie Supreme (₹329)
     
     Which one would you like to order?

User: I'll take 2 margherita

Bot: Excellent choice! Adding:
     • 2x Margherita Pizza
     
     Parsed Order: [🛒 Add to Cart]
     [2x Margherita Pizza]
```

## Color Scheme

### Light Mode
- **Floating Button:** Primary color (blue/brand color)
- **Header:** Primary color background, white text
- **User Messages:** Primary color background, white text
- **Bot Messages:** Muted gray background, dark text
- **Badges:** Secondary color
- **Add to Cart Button:** Primary color

### Dark Mode
- **Floating Button:** Primary color (adjusted for dark mode)
- **Header:** Primary color background, white text
- **User Messages:** Primary color background, white text
- **Bot Messages:** Dark muted background, light text
- **Badges:** Secondary color (adjusted)
- **Add to Cart Button:** Primary color (adjusted)

## Responsive Design

### Desktop (>768px)
```
┌─────────────────────────────────────────┐
│  Restaurant Menu                        │
│                                         │
│  [Wide Menu Grid]                       │
│                                         │
│                              ┌────┐     │
│                              │ 💬 │     │
│                              └────┘     │
│                                         │
│                        ┌──────────────┐ │
│                        │ Chat Window  │ │
│                        │ 400px wide   │ │
│                        │ 600px tall   │ │
│                        └──────────────┘ │
└─────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────┐
│  Restaurant Menu    │
│                     │
│  [Menu List]        │
│                     │
│              ┌────┐ │
│              │ 💬 │ │
│              └────┘ │
│                     │
│  ┌───────────────┐  │
│  │ Chat Window   │  │
│  │ Full width    │  │
│  │ (responsive)  │  │
│  └───────────────┘  │
└─────────────────────┘
```

## Interaction States

### 1. Idle State
- Floating button visible
- Subtle pulse animation
- Ready for click

### 2. Chat Open
- Window slides in from bottom-right
- Welcome message displayed
- Input field focused

### 3. User Typing
- Input field active
- Send button enabled when text present
- Character count (optional)

### 4. Processing
- Send button shows spinner
- Input field disabled
- "Typing..." indicator

### 5. Streaming Response
- Text appears word by word
- Smooth animation
- Spinner at end of text

### 6. Order Parsed
- Badges appear with animation
- "Add to Cart" button highlighted
- Ready for action

### 7. Items Added
- Success animation
- Toast notification
- Cart count updates
- Chat remains open for more orders

## Accessibility Features

### Keyboard Navigation
- Tab through interactive elements
- Enter to send message
- Escape to close chat
- Arrow keys to navigate messages

### Screen Reader Support
- ARIA labels on buttons
- Message role attributes
- Status announcements
- Focus management

### Visual Indicators
- Clear focus states
- High contrast text
- Loading indicators
- Error messages

## Animation Timing

```
Floating Button Hover: 0.3s ease
Chat Window Open: 0.4s slide-in
Message Appear: 0.2s fade-in
Streaming Text: Real-time (no delay)
Badge Appear: 0.3s scale-in
Button Hover: 0.2s ease
Toast Notification: 0.3s slide-down
```

## Error States

### Network Error
```
┌────────────────────────────────┐
│ ❌ Sorry, I encountered an     │
│ error processing your request. │
│ Please try again.              │
│                                │
│ [Retry]                        │
└────────────────────────────────┘
```

### No Items Found
```
┌────────────────────────────────┐
│ ⚠️ I couldn't find any of      │
│ those items on our menu.       │
│ Would you like to see what's   │
│ available?                     │
└────────────────────────────────┘
```

### Partial Match
```
┌────────────────────────────────┐
│ ✅ Added to cart!              │
│ 2 item(s) added to your cart.  │
│                                │
│ ⚠️ Some items not found        │
│ Could not find: Burger, Fries  │
└────────────────────────────────┘
```

## Best Practices for Users

### ✅ Good Examples
- "I want 2 Margherita Pizza and 1 Daal Tadka"
- "Get me 4 rotis"
- "Order 1 paneer tikka and 2 naan"
- "I'd like 3 butter naan, please"

### ❌ Avoid
- Just "pizza" (no quantity)
- "Give me food" (too vague)
- "The usual" (no context)
- Non-food queries

## Tips for Best Results

1. **Be Specific:** Include quantities and item names
2. **Use Natural Language:** Speak as you would to a waiter
3. **Check Parsed Items:** Review before adding to cart
4. **Ask Questions:** The bot can help you explore the menu
5. **Multiple Orders:** You can place multiple orders in one conversation

## Conclusion

The NLP Chatbot provides an intuitive, conversational way to order food. The visual design is clean, modern, and user-friendly, with clear feedback at every step. The interface adapts seamlessly to different screen sizes and provides a delightful ordering experience.

**Key Visual Elements:**
- 🎨 Clean, modern design
- 💬 Conversational interface
- 🎯 Clear call-to-actions
- ✨ Smooth animations
- 📱 Mobile-responsive
- ♿ Accessible to all users
