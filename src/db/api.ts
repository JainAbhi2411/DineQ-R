import { supabase } from './supabase';
import type {
  Profile,
  Restaurant,
  MenuCategory,
  MenuItem,
  Table,
  Order,
  OrderItem,
  OrderWithItems,
  OrderStatus,
  Staff,
  StaffWithAvailability,
  Message,
  VisitedRestaurant,
  VisitedRestaurantWithDetails,
  Notification,
  NotificationWithOrder,
  Review,
  ReviewWithCustomer,
  Promotion,
  PromotionUsage,
  PromotionValidation,
  CreatePromotionInput,
  UpdatePromotionInput,
  PromotionWithMenuItems,
  RestaurantSettings,
  AnalyticsData,
} from '@/types/types';

export const profileApi = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id || '')
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};

export const restaurantApi = {
  async getRestaurantsByOwner(ownerId: string): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async createRestaurant(restaurant: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .insert(restaurant)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async deleteRestaurant(id: string): Promise<void> {
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const menuCategoryApi = {
  async getCategoriesByRestaurant(restaurantId: string): Promise<MenuCategory[]> {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createCategory(category: Omit<MenuCategory, 'id' | 'created_at' | 'display_order'>): Promise<MenuCategory | null> {
    const { data: existingCategories } = await supabase
      .from('menu_categories')
      .select('display_order')
      .eq('restaurant_id', category.restaurant_id)
      .order('display_order', { ascending: false })
      .limit(1);
    
    const nextOrder = existingCategories && existingCategories.length > 0 
      ? existingCategories[0].display_order + 1 
      : 0;

    const { data, error } = await supabase
      .from('menu_categories')
      .insert({
        ...category,
        display_order: nextOrder,
      })
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory | null> {
    const { data, error } = await supabase
      .from('menu_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const menuItemApi = {
  async getItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getItemById(id: string): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async createItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(item)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const tableApi = {
  async getTablesByRestaurant(restaurantId: string): Promise<Table[]> {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('table_number', { ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getTableById(id: string): Promise<Table | null> {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getTableByQRCode(qrCodeData: string): Promise<Table | null> {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('qr_code_data', qrCodeData)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async createTable(table: Omit<Table, 'id' | 'created_at' | 'qr_code' | 'qr_code_data'>): Promise<Table | null> {
    const qrCode = `${table.restaurant_id}-${table.table_number}-${Date.now()}`;
    const { data, error } = await supabase
      .from('tables')
      .insert({
        ...table,
        qr_code: qrCode,
        qr_code_data: qrCode,
      })
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateTable(id: string, updates: Partial<Omit<Table, 'id' | 'created_at' | 'qr_code' | 'qr_code_data'>>): Promise<Table | null> {
    const { data, error } = await supabase
      .from('tables')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async deleteTable(id: string): Promise<void> {
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const orderApi = {
  async getOrdersByCustomer(customerId: string): Promise<OrderWithItems[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*, menu_item:menu_items(*)),
        table:tables(*),
        restaurant:restaurants(*),
        waiter:staff!waiter_id(*),
        status_history:order_status_history(*)
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .order('created_at', { foreignTable: 'order_status_history', ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getOrdersByRestaurant(restaurantId: string): Promise<OrderWithItems[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*, menu_item:menu_items(*)),
        table:tables(*),
        waiter:staff!waiter_id(*),
        customer:profiles!customer_id(*),
        status_history:order_status_history(*)
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .order('created_at', { foreignTable: 'order_status_history', ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getOrderById(id: string): Promise<OrderWithItems | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*, menu_item:menu_items(*)),
        table:tables(*),
        restaurant:restaurants(*),
        customer:profiles!customer_id(*),
        waiter:staff!waiter_id(*),
        status_history:order_status_history(*)
      `)
      .eq('id', id)
      .order('created_at', { foreignTable: 'order_status_history', ascending: true })
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const { error } = await supabase.rpc('update_order_status', {
      order_id: orderId,
      new_status: status,
    });
    if (error) throw error;
  },

  async updatePaymentStatus(orderId: string, paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'): Promise<void> {
    // Validate payment_status
    const validPaymentStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      console.error('[updatePaymentStatus] Invalid payment_status:', paymentStatus);
      throw new Error(`Invalid payment_status: ${paymentStatus}. Must be one of: ${validPaymentStatuses.join(', ')}`);
    }

    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', orderId);
    if (error) {
      console.error('[updatePaymentStatus] Database error:', error);
      throw error;
    }
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'currency' | 'stripe_session_id' | 'stripe_payment_intent_id' | 'customer_email' | 'customer_name' | 'completed_at'>): Promise<Order> {
    // Validate payment_status
    const validPaymentStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(order.payment_status)) {
      console.error('[createOrder] Invalid payment_status:', order.payment_status);
      throw new Error(`Invalid payment_status: ${order.payment_status}. Must be one of: ${validPaymentStatuses.join(', ')}`);
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...order,
        currency: 'USD',
      })
      .select()
      .single();
    if (error) {
      console.error('[createOrder] Database error:', error);
      throw error;
    }
    return data;
  },

  async createOrderItems(items: Omit<OrderItem, 'id' | 'created_at'>[]): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .insert(items)
      .select();
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getActiveOrderForCustomer(customerId: string, restaurantId: string, tableId?: string): Promise<OrderWithItems | null> {
    console.log('🔍 API: Checking for active order...', { customerId, restaurantId, tableId });
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(*, menu_item:menu_items(*)),
        table:tables(*),
        restaurant:restaurants(*),
        waiter:staff!waiter_id(*),
        status_history:order_status_history(*)
      `)
      .eq('customer_id', customerId)
      .eq('restaurant_id', restaurantId)
      .in('status', ['pending', 'preparing'])
      .order('created_at', { ascending: false })
      .limit(1);

    // Don't filter by table - customer may have moved tables or table context lost
    // if (tableId) {
    //   query = query.eq('table_id', tableId);
    // }

    const { data, error } = await query;
    
    console.log('📊 API: Query result:', { data, error });
    
    if (error) {
      console.error('❌ API: Error fetching active order:', error);
      throw error;
    }
    
    // Get the first order (most recent)
    const order = Array.isArray(data) && data.length > 0 ? data[0] : null;
    
    if (!order) {
      console.log('➡️ API: No active order found');
      return null;
    }
    
    // Smart filtering: Only return orders created within the last hour
    const orderAge = Date.now() - new Date(order.created_at).getTime();
    const oneHourInMs = 60 * 60 * 1000;
    const ageInMinutes = Math.floor(orderAge / 60000);
    
    console.log('⏰ API: Order age check:', { 
      orderId: order.id,
      ageInMinutes, 
      withinOneHour: orderAge <= oneHourInMs 
    });
    
    // If order is older than 1 hour, don't suggest adding to it
    if (orderAge > oneHourInMs) {
      console.log('⏰ API: Order too old (> 1 hour), not suggesting to add');
      return null;
    }
    
    console.log('✅ API: Active order found and valid!', {
      orderId: order.id,
      status: order.status,
      itemCount: order.order_items?.length,
      ageInMinutes
    });
    
    return order;
  },

  async addItemsToExistingOrder(orderId: string, items: Omit<OrderItem, 'id' | 'created_at'>[], newTotal: number): Promise<void> {
    // Insert new order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(items);
    if (itemsError) throw itemsError;

    // Update order total and timestamp
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        total_amount: newTotal,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);
    if (orderError) throw orderError;

    // Add status history entry for tracking
    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status: 'pending',
        notes: 'Additional items added to order',
      });
    if (historyError) throw historyError;
  },

  async assignWaiterToOrder(orderId: string, waiterId: string | null): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ waiter_id: waiterId })
      .eq('id', orderId);
    if (error) throw error;
  },
};

export const imageApi = {
  async uploadImage(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('app-7x1ojvae4075_food_images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('app-7x1ojvae4075_food_images')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  },

  async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('app-7x1ojvae4075_food_images')
      .remove([path]);
    if (error) throw error;
  },
};

export const staffApi = {
  async getStaffByRestaurant(restaurantId: string): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('name', { ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getWaitersWithAvailability(restaurantId: string): Promise<StaffWithAvailability[]> {
    const { data, error } = await supabase
      .rpc('get_free_waiters', { p_restaurant_id: restaurantId });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getFreeWaiters(restaurantId: string): Promise<Staff[]> {
    const { data, error } = await supabase
      .rpc('get_free_waiters', { p_restaurant_id: restaurantId });
    if (error) throw error;
    const waiters = Array.isArray(data) ? data : [];
    return waiters.filter((w: StaffWithAvailability) => !w.is_busy);
  },

  async createStaff(staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .insert(staff)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStaff(id: string, updates: Partial<Staff>): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteStaff(id: string): Promise<void> {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async assignWaiterToOrder(orderId: string, staffId: string | null): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ waiter_id: staffId })
      .eq('id', orderId);
    if (error) throw error;
  },
};

export const messageApi = {
  async getMessagesByOrder(orderId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getMessagesByRestaurant(restaurantId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async sendMessage(message: Omit<Message, 'id' | 'created_at' | 'is_read'>): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...message,
        is_read: false,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async markMessagesAsRead(orderId: string, userId: string): Promise<void> {
    const { error } = await supabase.rpc('mark_messages_as_read', {
      p_order_id: orderId,
      p_user_id: userId,
    });
    if (error) throw error;
  },
};

export const visitedRestaurantApi = {
  async upsertVisitedRestaurant(customerId: string, restaurantId: string): Promise<VisitedRestaurant | null> {
    const { data, error } = await supabase.rpc('upsert_visited_restaurant', {
      p_customer_id: customerId,
      p_restaurant_id: restaurantId,
    });
    if (error) throw error;
    return data;
  },

  async getVisitedRestaurants(customerId: string): Promise<VisitedRestaurantWithDetails[]> {
    const { data, error } = await supabase
      .from('visited_restaurants')
      .select(`
        *,
        restaurant:restaurants(*)
      `)
      .eq('customer_id', customerId)
      .order('last_visited_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async deleteVisitedRestaurant(id: string): Promise<void> {
    const { error } = await supabase
      .from('visited_restaurants')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const notificationApi = {
  async getNotifications(userId: string, limit = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
    return count || 0;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase.rpc('mark_notification_as_read', {
      notification_id: notificationId,
    });
    if (error) throw error;
  },

  async markAllAsRead(): Promise<void> {
    const { error } = await supabase.rpc('mark_all_notifications_as_read');
    if (error) throw error;
  },

  async deleteNotification(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const reviewApi = {
  async getReviewsByRestaurant(restaurantId: string): Promise<ReviewWithCustomer[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        customer:profiles!customer_id(*)
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createReview(review: Omit<Review, 'id' | 'created_at' | 'reply' | 'replied_at'>): Promise<Review> {
    const { data, error} = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async replyToReview(reviewId: string, reply: string): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update({ 
        reply, 
        replied_at: new Date().toISOString() 
      })
      .eq('id', reviewId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAverageRating(restaurantId: string): Promise<number> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('restaurant_id', restaurantId);
    if (error) throw error;
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, review) => acc + review.rating, 0);
    return sum / data.length;
  },
};

export const promotionApi = {
  async getPromotionsByRestaurant(restaurantId: string): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getActivePromotionsForCustomer(restaurantId: string): Promise<Promotion[]> {
    const now = new Date().toISOString();
    console.log('[promotionApi] Fetching active promotions for restaurant:', restaurantId);
    console.log('[promotionApi] Current time:', now);
    
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now)
      .order('created_at', { ascending: false });
    
    console.log('[promotionApi] Query result:', { data, error });
    
    if (error) {
      console.error('[promotionApi] Error fetching promotions:', error);
      throw error;
    }
    
    const promotions = Array.isArray(data) ? data : [];
    console.log('[promotionApi] Returning promotions:', promotions.length);
    return promotions;
  },

  async createPromotion(promotion: CreatePromotionInput): Promise<Promotion> {
    const { data, error } = await supabase
      .from('promotions')
      .insert(promotion)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Failed to create promotion');
    return data;
  },

  async updatePromotion(id: string, updates: UpdatePromotionInput): Promise<Promotion> {
    const { data, error } = await supabase
      .from('promotions')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Promotion not found');
    return data;
  },

  async deletePromotion(id: string): Promise<void> {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async validatePromoCode(
    code: string,
    restaurantId: string,
    customerId: string,
    orderAmount: number
  ): Promise<PromotionValidation> {
    const { data, error } = await supabase.rpc('validate_promotion_code', {
      p_code: code,
      p_restaurant_id: restaurantId,
      p_customer_id: customerId,
      p_order_amount: orderAmount,
    });
    if (error) throw error;
    if (!Array.isArray(data) || data.length === 0) {
      return {
        valid: false,
        promotion_id: null,
        discount_amount: 0,
        error_message: 'Failed to validate promotion code',
      };
    }
    return data[0];
  },

  async recordPromotionUsage(
    promotionId: string,
    customerId: string,
    orderId: string,
    discountAmount: number
  ): Promise<PromotionUsage> {
    const { data, error } = await supabase
      .from('promotion_usage')
      .insert({
        promotion_id: promotionId,
        customer_id: customerId,
        order_id: orderId,
        discount_amount: discountAmount,
      })
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Failed to record promotion usage');
    return data;
  },

  async getPromotionUsageStats(promotionId: string): Promise<{
    total_uses: number;
    total_discount: number;
    unique_customers: number;
  }> {
    const { data, error } = await supabase
      .from('promotion_usage')
      .select('discount_amount, customer_id')
      .eq('promotion_id', promotionId);
    if (error) throw error;
    if (!Array.isArray(data)) {
      return { total_uses: 0, total_discount: 0, unique_customers: 0 };
    }
    const uniqueCustomers = new Set(data.map(u => u.customer_id)).size;
    const totalDiscount = data.reduce((sum, u) => sum + Number(u.discount_amount), 0);
    return {
      total_uses: data.length,
      total_discount: totalDiscount,
      unique_customers: uniqueCustomers,
    };
  },

  async getCustomerPromotionUsage(customerId: string, promotionId: string): Promise<number> {
    const { data, error } = await supabase
      .from('promotion_usage')
      .select('id')
      .eq('customer_id', customerId)
      .eq('promotion_id', promotionId);
    if (error) throw error;
    return Array.isArray(data) ? data.length : 0;
  },
};

export const settingsApi = {
  async getRestaurantSettings(restaurantId: string): Promise<RestaurantSettings | null> {
    const { data, error } = await supabase
      .from('restaurant_settings')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .maybeSingle();
    if (error) throw error;
    
    // If no settings exist, create default settings
    if (!data) {
      return await this.createDefaultSettings(restaurantId);
    }
    
    return data;
  },

  async createDefaultSettings(restaurantId: string): Promise<RestaurantSettings> {
    const { data, error } = await supabase
      .from('restaurant_settings')
      .insert({
        restaurant_id: restaurantId,
        timezone: 'America/New_York',
        currency: 'USD',
        auto_accept_orders: false,
        online_ordering: true,
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,
        review_alerts: true,
        tax_rate: 0,
        service_charge: 0,
        two_factor_auth: false,
        business_hours: {
          monday: { open: '09:00', close: '22:00', closed: false },
          tuesday: { open: '09:00', close: '22:00', closed: false },
          wednesday: { open: '09:00', close: '22:00', closed: false },
          thursday: { open: '09:00', close: '22:00', closed: false },
          friday: { open: '09:00', close: '22:00', closed: false },
          saturday: { open: '09:00', close: '22:00', closed: false },
          sunday: { open: '09:00', close: '22:00', closed: false },
        },
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateRestaurantSettings(id: string, updates: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    const { data, error } = await supabase
      .from('restaurant_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export const analyticsApi = {
  async getAnalytics(restaurantId: string): Promise<AnalyticsData> {
    // Get all orders with their items for accurate calculations
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        customer_id,
        created_at,
        status,
        payment_status
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: true });
    
    if (ordersError) throw ordersError;

    // Calculate total revenue from all orders (regardless of status for now, can filter if needed)
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const uniqueCustomers = new Set(orders?.map(o => o.customer_id).filter(Boolean)).size;

    // Get average rating
    const averageRating = await reviewApi.getAverageRating(restaurantId);

    // Get all order items for this restaurant to calculate popular items
    const { data: allOrderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        menu_item_id,
        menu_item_name,
        quantity,
        price,
        order_id
      `);

    if (itemsError) throw itemsError;

    // Filter order items that belong to this restaurant's orders
    const orderIds = new Set(orders?.map(o => o.id) || []);
    const restaurantOrderItems = allOrderItems?.filter(item => orderIds.has(item.order_id)) || [];

    // Aggregate popular items by counting total quantity ordered
    const itemsMap = new Map<string, { 
      menu_item_id: string; 
      menu_item_name: string; 
      order_count: number; 
      total_revenue: number;
    }>();

    restaurantOrderItems.forEach((item) => {
      const itemId = item.menu_item_id || 'unknown';
      const existing = itemsMap.get(itemId);
      const itemRevenue = Number(item.price || 0) * Number(item.quantity || 0);
      
      if (existing) {
        existing.order_count += Number(item.quantity || 0);
        existing.total_revenue += itemRevenue;
      } else {
        itemsMap.set(itemId, {
          menu_item_id: itemId,
          menu_item_name: item.menu_item_name || 'Unknown Item',
          order_count: Number(item.quantity || 0),
          total_revenue: itemRevenue,
        });
      }
    });

    // Sort by order count (most ordered items first)
    const popularItems = Array.from(itemsMap.values())
      .sort((a, b) => b.order_count - a.order_count)
      .slice(0, 10);

    // Get revenue by date
    const revenueByDateMap = new Map<string, { revenue: number; order_count: number }>();
    orders?.forEach(order => {
      const date = order.created_at.split('T')[0];
      const existing = revenueByDateMap.get(date);
      const orderAmount = Number(order.total_amount || 0);
      
      if (existing) {
        existing.revenue += orderAmount;
        existing.order_count += 1;
      } else {
        revenueByDateMap.set(date, {
          revenue: orderAmount,
          order_count: 1,
        });
      }
    });

    const revenueByDate = Array.from(revenueByDateMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        order_count: data.order_count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalRevenue,
      totalOrders,
      uniqueCustomers,
      averageRating,
      popularItems,
      revenueByDate,
    };
  },
};
