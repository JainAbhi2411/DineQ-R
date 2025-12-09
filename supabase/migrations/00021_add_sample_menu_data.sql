/*
# Add Sample Menu Data for UI Testing

## Purpose
Add comprehensive sample menu data to test the currency and timezone formatting in the UI.

## Data Added
1. **Menu Categories**:
   - Appetizers
   - Soups & Salads
   - Main Course (already exists)
   - Desserts
   - Beverages
   - Specials

2. **Menu Items** (20+ items across all categories):
   - Various price points to test currency formatting
   - Different types of dishes
   - Realistic descriptions and details

## Notes
- All items are marked as available
- Prices range from $3.99 to $45.99 to test various formatting scenarios
- Items include dietary information (vegetarian, vegan, gluten-free)
- Some items marked as bestsellers
*/

-- Get the restaurant ID (assuming there's only one restaurant for now)
DO $$
DECLARE
  v_restaurant_id uuid;
  v_appetizers_id uuid;
  v_soups_id uuid;
  v_main_id uuid;
  v_desserts_id uuid;
  v_beverages_id uuid;
  v_specials_id uuid;
BEGIN
  -- Get the restaurant ID
  SELECT id INTO v_restaurant_id FROM restaurants LIMIT 1;
  
  -- Get existing Main Course category
  SELECT id INTO v_main_id FROM menu_categories WHERE restaurant_id = v_restaurant_id AND name = 'Main Course';
  
  -- Insert additional categories
  INSERT INTO menu_categories (id, restaurant_id, name, description, display_order)
  VALUES
    (gen_random_uuid(), v_restaurant_id, 'Appetizers', 'Start your meal with our delicious starters', 1),
    (gen_random_uuid(), v_restaurant_id, 'Soups & Salads', 'Fresh and healthy options', 2),
    (gen_random_uuid(), v_restaurant_id, 'Desserts', 'Sweet endings to your meal', 4),
    (gen_random_uuid(), v_restaurant_id, 'Beverages', 'Refreshing drinks and cocktails', 5),
    (gen_random_uuid(), v_restaurant_id, 'Specials', 'Chef''s special recommendations', 6)
  ON CONFLICT DO NOTHING
  RETURNING id;
  
  -- Update Main Course display order
  UPDATE menu_categories SET display_order = 3 WHERE id = v_main_id;
  
  -- Get category IDs
  SELECT id INTO v_appetizers_id FROM menu_categories WHERE restaurant_id = v_restaurant_id AND name = 'Appetizers';
  SELECT id INTO v_soups_id FROM menu_categories WHERE restaurant_id = v_restaurant_id AND name = 'Soups & Salads';
  SELECT id INTO v_desserts_id FROM menu_categories WHERE restaurant_id = v_restaurant_id AND name = 'Desserts';
  SELECT id INTO v_beverages_id FROM menu_categories WHERE restaurant_id = v_restaurant_id AND name = 'Beverages';
  SELECT id INTO v_specials_id FROM menu_categories WHERE restaurant_id = v_restaurant_id AND name = 'Specials';
  
  -- Insert Appetizers
  INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, is_available, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories, rating, is_bestseller)
  VALUES
    (gen_random_uuid(), v_restaurant_id, v_appetizers_id, 'Crispy Spring Rolls', 'Fresh vegetables wrapped in crispy pastry, served with sweet chili sauce', 8.99, true, true, true, false, 15, 180, 4.5, true),
    (gen_random_uuid(), v_restaurant_id, v_appetizers_id, 'Buffalo Wings', 'Spicy chicken wings with blue cheese dip and celery sticks', 12.99, true, false, false, true, 20, 420, 4.7, true),
    (gen_random_uuid(), v_restaurant_id, v_appetizers_id, 'Mozzarella Sticks', 'Golden fried mozzarella with marinara sauce', 9.99, true, true, false, false, 12, 350, 4.3, false),
    (gen_random_uuid(), v_restaurant_id, v_appetizers_id, 'Garlic Bread', 'Toasted bread with garlic butter and herbs', 5.99, true, true, false, false, 8, 220, 4.2, false),
    (gen_random_uuid(), v_restaurant_id, v_appetizers_id, 'Calamari Rings', 'Crispy fried squid rings with lemon aioli', 13.99, true, false, false, false, 18, 380, 4.6, false);
  
  -- Insert Soups & Salads
  INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, is_available, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories, rating, is_bestseller)
  VALUES
    (gen_random_uuid(), v_restaurant_id, v_soups_id, 'Caesar Salad', 'Crisp romaine lettuce with parmesan, croutons, and Caesar dressing', 11.99, true, true, false, false, 10, 280, 4.4, true),
    (gen_random_uuid(), v_restaurant_id, v_soups_id, 'Tomato Basil Soup', 'Creamy tomato soup with fresh basil and croutons', 7.99, true, true, false, false, 15, 220, 4.5, false),
    (gen_random_uuid(), v_restaurant_id, v_soups_id, 'Greek Salad', 'Fresh vegetables with feta cheese, olives, and olive oil', 10.99, true, true, false, true, 8, 240, 4.3, false),
    (gen_random_uuid(), v_restaurant_id, v_soups_id, 'French Onion Soup', 'Classic onion soup with melted cheese and croutons', 8.99, true, true, false, false, 20, 320, 4.6, false);
  
  -- Insert Main Course items
  INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, is_available, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories, rating, is_bestseller, spice_level)
  VALUES
    (gen_random_uuid(), v_restaurant_id, v_main_id, 'Grilled Salmon', 'Fresh Atlantic salmon with lemon butter sauce, served with vegetables', 24.99, true, false, false, true, 25, 520, 4.8, true, 'mild'),
    (gen_random_uuid(), v_restaurant_id, v_main_id, 'Beef Tenderloin Steak', 'Premium 8oz tenderloin with garlic mashed potatoes', 35.99, true, false, false, true, 30, 680, 4.9, true, 'mild'),
    (gen_random_uuid(), v_restaurant_id, v_main_id, 'Chicken Alfredo Pasta', 'Creamy fettuccine with grilled chicken and parmesan', 18.99, true, false, false, false, 20, 720, 4.6, true, 'mild'),
    (gen_random_uuid(), v_restaurant_id, v_main_id, 'Vegetable Stir Fry', 'Mixed vegetables in Asian sauce with jasmine rice', 15.99, true, true, true, true, 18, 420, 4.4, false, 'medium'),
    (gen_random_uuid(), v_restaurant_id, v_main_id, 'BBQ Ribs', 'Slow-cooked pork ribs with BBQ sauce and coleslaw', 26.99, true, false, false, true, 35, 850, 4.7, true, 'medium'),
    (gen_random_uuid(), v_restaurant_id, v_main_id, 'Margherita Pizza', 'Classic pizza with tomato, mozzarella, and fresh basil', 16.99, true, true, false, false, 15, 580, 4.5, false, 'mild'),
    (gen_random_uuid(), v_restaurant_id, v_main_id, 'Lamb Curry', 'Tender lamb in aromatic curry sauce with basmati rice', 22.99, true, false, false, true, 28, 620, 4.6, false, 'hot'),
    (gen_random_uuid(), v_restaurant_id, v_main_id, 'Seafood Paella', 'Spanish rice dish with mixed seafood and saffron', 28.99, true, false, false, true, 35, 680, 4.8, true, 'mild');
  
  -- Insert Desserts
  INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, is_available, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories, rating, is_bestseller)
  VALUES
    (gen_random_uuid(), v_restaurant_id, v_desserts_id, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', 9.99, true, true, false, false, 12, 480, 4.9, true),
    (gen_random_uuid(), v_restaurant_id, v_desserts_id, 'Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers', 8.99, true, true, false, false, 5, 420, 4.7, true),
    (gen_random_uuid(), v_restaurant_id, v_desserts_id, 'New York Cheesecake', 'Creamy cheesecake with berry compote', 8.99, true, true, false, false, 5, 520, 4.6, false),
    (gen_random_uuid(), v_restaurant_id, v_desserts_id, 'Apple Pie', 'Homemade apple pie with cinnamon and vanilla ice cream', 7.99, true, true, false, false, 8, 380, 4.5, false),
    (gen_random_uuid(), v_restaurant_id, v_desserts_id, 'Crème Brûlée', 'Classic French custard with caramelized sugar top', 9.99, true, true, false, true, 10, 350, 4.8, false);
  
  -- Insert Beverages
  INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, is_available, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories, rating)
  VALUES
    (gen_random_uuid(), v_restaurant_id, v_beverages_id, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 5.99, true, true, true, true, 3, 120, 4.4),
    (gen_random_uuid(), v_restaurant_id, v_beverages_id, 'Iced Coffee', 'Cold brew coffee with ice', 4.99, true, true, true, true, 2, 80, 4.3),
    (gen_random_uuid(), v_restaurant_id, v_beverages_id, 'Mojito', 'Classic Cuban cocktail with mint and lime', 10.99, true, true, true, true, 5, 180, 4.6),
    (gen_random_uuid(), v_restaurant_id, v_beverages_id, 'Craft Beer', 'Selection of local craft beers', 7.99, true, true, true, true, 2, 200, 4.5),
    (gen_random_uuid(), v_restaurant_id, v_beverages_id, 'Sparkling Water', 'Premium sparkling mineral water', 3.99, true, true, true, true, 1, 0, 4.2);
  
  -- Insert Specials
  INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, is_available, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories, rating, is_bestseller, spice_level)
  VALUES
    (gen_random_uuid(), v_restaurant_id, v_specials_id, 'Chef''s Tasting Menu', 'Five-course tasting menu featuring seasonal ingredients', 65.99, true, false, false, false, 90, 1800, 5.0, true, 'mild'),
    (gen_random_uuid(), v_restaurant_id, v_specials_id, 'Lobster Thermidor', 'Whole lobster in creamy brandy sauce with truffle mashed potatoes', 45.99, true, false, false, true, 40, 720, 4.9, true, 'mild'),
    (gen_random_uuid(), v_restaurant_id, v_specials_id, 'Wagyu Beef Burger', 'Premium wagyu beef burger with aged cheddar and truffle fries', 32.99, true, false, false, false, 25, 980, 4.8, true, 'mild');
  
END $$;
