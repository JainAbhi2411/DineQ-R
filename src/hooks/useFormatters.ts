import { useSettings } from '@/contexts/SettingsContext';
import { formatCurrency as baseCurrency, formatDateTime as baseDateTime, formatDate as baseDate, formatTime as baseTime, formatRelativeTime } from '@/utils/formatters';

/**
 * Custom hook that provides formatting functions with restaurant settings applied
 */
export function useFormatters() {
  const { settings } = useSettings();
  
  const timezone = settings?.timezone || 'America/New_York';

  return {
    /**
     * Format a price in INR
     */
    formatCurrency: (amount: number) => baseCurrency(amount),
    
    /**
     * Format a date/time in the restaurant's timezone
     */
    formatDateTime: (date: string | Date, formatString?: string) => 
      baseDateTime(date, timezone, formatString),
    
    /**
     * Format a date in the restaurant's timezone
     */
    formatDate: (date: string | Date) => baseDate(date, timezone),
    
    /**
     * Format a time in the restaurant's timezone
     */
    formatTime: (date: string | Date) => baseTime(date, timezone),
    
    /**
     * Format a relative time (e.g., "2 hours ago")
     */
    formatRelativeTime,
    
    /**
     * Get the current timezone
     */
    timezone,
  };
}
