# Visited Restaurants Feature

## Overview
This feature allows customers to save restaurants they've visited by scanning QR codes, providing quick access for reordering without needing to scan again.

## Key Features

### 1. Automatic Restaurant Tracking
- When a customer scans a QR code, the restaurant is automatically added to their visited list
- Visit count and timestamps are tracked automatically
- Duplicate entries are prevented with unique constraints

### 2. Restaurant Cards on Dashboard
- Visited restaurants appear as interactive cards on the customer dashboard
- Cards display:
  - Restaurant name
  - Location
  - Visit count
  - Store icon for visual appeal

### 3. Quick Reordering
- Click on any restaurant card to go directly to the menu
- No need to scan QR code again
- Seamless navigation to the ordering flow

### 4. Restaurant Management
- Hover over a card to reveal the remove button (X icon)
- Click the X to remove a restaurant from your list
- Smooth animations and transitions for better UX

## Technical Implementation

### Database Schema
```sql
CREATE TABLE visited_restaurants (
  id uuid PRIMARY KEY,
  customer_id uuid REFERENCES profiles(id),
  restaurant_id uuid REFERENCES restaurants(id),
  first_visited_at timestamptz,
  last_visited_at timestamptz,
  visit_count integer,
  UNIQUE(customer_id, restaurant_id)
);
```

### Key Functions
- `upsert_visited_restaurant()`: Automatically increments visit count on subsequent visits
- `getVisitedRestaurants()`: Retrieves all visited restaurants with full details
- `deleteVisitedRestaurant()`: Removes a restaurant from the visited list

### Security
- Row Level Security (RLS) enabled
- Customers can only view and manage their own visited restaurants
- All operations are authenticated and authorized

## User Flow

1. **First Visit**
   - Customer scans QR code at restaurant table
   - Restaurant is automatically saved to their visited list
   - Customer proceeds to menu

2. **Subsequent Visits**
   - Customer can either:
     - Scan QR code again (visit count increments)
     - Click on restaurant card from dashboard (quick access)

3. **Managing List**
   - View all visited restaurants on dashboard
   - Remove unwanted restaurants by hovering and clicking X
   - Cards are sorted by most recently visited

## UI/UX Highlights

### Restaurant Cards
- Clean, modern card design with hover effects
- Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
- Visual feedback on hover with border color change and shadow
- Icon-based design for quick recognition

### Interactions
- Smooth transitions and animations
- Hidden remove button that appears on hover
- Click anywhere on card to navigate to menu
- Toast notifications for success/error feedback

## Benefits

### For Customers
- Save time by not needing to scan QR codes repeatedly
- Quick access to favorite restaurants
- Track visit history
- Personalized dashboard experience

### For Restaurant Owners
- Increased customer retention
- Easier reordering process
- Better customer engagement
- Insights into repeat customers

## Future Enhancements (Potential)
- Sort options (by name, visit count, last visited)
- Search/filter functionality
- Favorite/bookmark specific restaurants
- Show last order from each restaurant
- Quick reorder from previous orders
