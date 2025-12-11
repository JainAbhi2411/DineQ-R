import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { weeklyTasksApi } from '@/db/api';

/**
 * Hook for tracking weekly task progress
 * Automatically updates task progress when customer activities occur
 */
export function useTaskProgress() {
  const { user } = useAuth();

  /**
   * Track order-related tasks
   * Called when a customer places an order
   */
  const trackOrderPlaced = useCallback(async (orderId: string, orderTotal: number) => {
    if (!user?.id) return;

    try {
      // Track order count
      await weeklyTasksApi.incrementTaskProgress(
        user.id,
        'order_count',
        1,
        orderId
      );

      // Track spending amount
      await weeklyTasksApi.incrementTaskProgress(
        user.id,
        'spending_amount',
        Math.round(orderTotal * 100), // Convert to cents
        orderId
      );

      console.log('[TaskProgress] Order tracked:', { orderId, orderTotal });
    } catch (error) {
      console.error('[TaskProgress] Error tracking order:', error);
    }
  }, [user?.id]);

  /**
   * Track review-related tasks
   * Called when a customer submits a review
   */
  const trackReviewSubmitted = useCallback(async () => {
    if (!user?.id) return;

    try {
      await weeklyTasksApi.incrementTaskProgress(
        user.id,
        'review_count',
        1
      );

      console.log('[TaskProgress] Review tracked');
    } catch (error) {
      console.error('[TaskProgress] Error tracking review:', error);
    }
  }, [user?.id]);

  /**
   * Track restaurant visit tasks
   * Called when a customer visits/orders from a restaurant
   */
  const trackRestaurantVisit = useCallback(async (restaurantId: string) => {
    if (!user?.id) return;

    try {
      await weeklyTasksApi.incrementTaskProgress(
        user.id,
        'visit_count',
        1
      );

      console.log('[TaskProgress] Restaurant visit tracked:', restaurantId);
    } catch (error) {
      console.error('[TaskProgress] Error tracking visit:', error);
    }
  }, [user?.id]);

  /**
   * Track daily login tasks
   * Called when a customer logs in (should be called once per day)
   */
  const trackDailyLogin = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Check if already tracked today
      const lastLoginKey = `last_login_tracked_${user.id}`;
      const lastLogin = localStorage.getItem(lastLoginKey);
      const today = new Date().toDateString();

      if (lastLogin === today) {
        console.log('[TaskProgress] Login already tracked today');
        return;
      }

      await weeklyTasksApi.incrementTaskProgress(
        user.id,
        'login_days',
        1
      );

      localStorage.setItem(lastLoginKey, today);
      console.log('[TaskProgress] Daily login tracked');
    } catch (error) {
      console.error('[TaskProgress] Error tracking login:', error);
    }
  }, [user?.id]);

  return {
    trackOrderPlaced,
    trackReviewSubmitted,
    trackRestaurantVisit,
    trackDailyLogin,
  };
}
