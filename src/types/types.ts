export type UserRole = 'owner' | 'customer';
export type OrderStatus = 'pending' | 'preparing' | 'served' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type RestaurantType = 'veg' | 'non_veg' | 'both';
export type ItemType = 'veg' | 'non_veg' | 'vegan' | 'egg';
export type SpiceLevel = 'none' | 'mild' | 'medium' | 'hot' | 'extra_hot';

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string;
  preferences: Record<string, any>;
  created_at: string;
}

export interface OpeningHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface WeeklyHours {
  monday?: OpeningHours;
  tuesday?: OpeningHours;
  wednesday?: OpeningHours;
  thursday?: OpeningHours;
  friday?: OpeningHours;
  saturday?: OpeningHours;
  sunday?: OpeningHours;
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  location: string | null;
  contact_details: string | null;
  business_info: string | null;
  restaurant_type: RestaurantType;
  cuisine_types: string[] | null;
  images: string[] | null;
  description: string | null;
  phone: string | null;
  address: string | null;
  average_rating: number;
  opening_hours: WeeklyHours | null;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItemVariant {
  name: string;
  price: number;
  description?: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  item_type: ItemType;
  variants: MenuItemVariant[] | null;
  rating: number;
  is_bestseller: boolean;
  tags: string[] | null;
  ingredients: string | null;
  allergens: string | null;
  preparation_time: number;
  calories: number | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  spice_level: SpiceLevel | null;
  has_portions: boolean;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: string;
  capacity: number;
  qr_code: string;
  qr_code_data: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  restaurant_id: string;
  table_id: string | null;
  assigned_to: string | null;
  waiter_id: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: 'online' | 'coc';
  total_amount: number;
  currency: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  special_instructions: string | null;
  completed_at: string | null;
  promotion_id: string | null;
  discount_amount: number;
  promo_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  restaurant_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  role: 'waiter' | 'chef' | 'manager' | 'cashier';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StaffWithAvailability extends Staff {
  is_busy: boolean;
}

export interface Message {
  id: string;
  order_id: string | null;
  restaurant_id: string;
  sender_id: string;
  sender_type: 'customer' | 'owner' | 'staff';
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  menu_item_name: string;
  menu_item?: MenuItem;
  quantity: number;
  price: number;
  notes: string | null;
  portion_size: string | null;
  variant_name: string | null;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus | null;
  notes: string | null;
  created_at: string;
  created_by: string | null;
}

export interface OrderWithItems extends Order {
  order_items?: OrderItem[];
  table?: Table;
  restaurant?: Restaurant;
  customer?: Profile;
  staff?: Staff;
  waiter?: Staff;
  status_history?: OrderStatusHistory[];
}

export interface MenuItemWithCategory extends MenuItem {
  category?: MenuCategory;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  notes?: string;
  selectedVariant?: MenuItemVariant;
  portionSize?: string;
}

export interface VisitedRestaurant {
  id: string;
  customer_id: string;
  restaurant_id: string;
  first_visited_at: string;
  last_visited_at: string;
  visit_count: number;
  created_at: string;
}

export interface VisitedRestaurantWithDetails extends VisitedRestaurant {
  restaurant?: Restaurant;
}

export type NotificationType = 'new_order' | 'order_status_change' | 'order_completed';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  order_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationWithOrder extends Notification {
  order?: Order;
}

export interface Review {
  id: string;
  restaurant_id: string;
  customer_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  reply: string | null;
  replied_at: string | null;
  created_at: string;
}

export interface ReviewWithCustomer extends Review {
  customer?: Profile;
  order?: Order;
}

export interface PromotionWithMenuItems {
  menu_item_ids?: string[];
}

export interface RestaurantSettings {
  id: string;
  restaurant_id: string;
  timezone: string;
  currency: string;
  auto_accept_orders: boolean;
  online_ordering: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  review_alerts: boolean;
  tax_rate: number;
  service_charge: number;
  two_factor_auth: boolean;
  business_hours: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  uniqueCustomers: number;
  averageRating: number;
  popularItems: {
    menu_item_id: string;
    menu_item_name: string;
    order_count: number;
    total_revenue: number;
  }[];
  revenueByDate: {
    date: string;
    revenue: number;
    order_count: number;
  }[];
}

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Promotion {
  id: string;
  restaurant_id: string;
  code: string;
  title: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  start_date: string;
  end_date: string;
  usage_limit_per_customer: number | null;
  total_usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  terms: string | null;
  created_at: string;
  updated_at: string;
}

export interface PromotionUsage {
  id: string;
  promotion_id: string;
  customer_id: string;
  order_id: string;
  discount_amount: number;
  used_at: string;
}

export interface PromotionValidation {
  valid: boolean;
  promotion_id: string | null;
  discount_amount: number;
  error_message: string | null;
}

export interface CreatePromotionInput {
  restaurant_id: string;
  code: string;
  title: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount?: number;
  max_discount?: number;
  start_date: string;
  end_date: string;
  usage_limit_per_customer?: number;
  total_usage_limit?: number;
  terms?: string;
}

export interface UpdatePromotionInput {
  code?: string;
  title?: string;
  description?: string;
  discount_type?: DiscountType;
  discount_value?: number;
  min_order_amount?: number;
  max_discount?: number;
  start_date?: string;
  end_date?: string;
  usage_limit_per_customer?: number;
  total_usage_limit?: number;
  is_active?: boolean;
  terms?: string;
}
