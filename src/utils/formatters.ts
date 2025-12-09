import { format as dateFnsFormat, toZonedTime } from 'date-fns-tz';

// Currency symbols mapping
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  AUD: '$',
  CAD: '$',
  CHF: 'Fr',
  INR: '₹',
  AED: 'د.إ',
};

// Currency locale mapping for proper formatting
const CURRENCY_LOCALES: Record<string, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  CNY: 'zh-CN',
  AUD: 'en-AU',
  CAD: 'en-CA',
  CHF: 'de-CH',
  INR: 'en-IN',
  AED: 'ar-AE',
};

/**
 * Format a price with the specified currency
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., 'USD', 'EUR')
 * @returns Formatted price string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const locale = CURRENCY_LOCALES[currency] || 'en-US';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback to simple formatting if currency is not supported
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Get currency symbol for a given currency code
 * @param currency - The currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: string = 'USD'): string {
  return CURRENCY_SYMBOLS[currency] || currency;
}

/**
 * Format a date/time in the specified timezone
 * @param date - The date to format
 * @param timezone - The timezone (e.g., 'America/New_York')
 * @param formatString - The format string (default: 'MMM dd, yyyy HH:mm')
 * @returns Formatted date string
 */
export function formatDateTime(
  date: string | Date,
  timezone: string = 'America/New_York',
  formatString: string = 'MMM dd, yyyy HH:mm'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const zonedDate = toZonedTime(dateObj, timezone);
    return dateFnsFormat(zonedDate, formatString, { timeZone: timezone });
  } catch (error) {
    console.error('Error formatting date:', error);
    return typeof date === 'string' ? date : date.toLocaleString();
  }
}

/**
 * Format a date in the specified timezone
 * @param date - The date to format
 * @param timezone - The timezone
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  timezone: string = 'America/New_York'
): string {
  return formatDateTime(date, timezone, 'MMM dd, yyyy');
}

/**
 * Format a time in the specified timezone
 * @param date - The date to format
 * @param timezone - The timezone
 * @returns Formatted time string
 */
export function formatTime(
  date: string | Date,
  timezone: string = 'America/New_York'
): string {
  return formatDateTime(date, timezone, 'HH:mm');
}

/**
 * Format a relative time (e.g., "2 hours ago")
 * @param date - The date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(dateObj);
  }
}
