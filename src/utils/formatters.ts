import { format as dateFnsFormat, toZonedTime } from 'date-fns-tz';

/**
 * Format a price in INR (Indian Rupees)
 * @param amount - The amount to format
 * @returns Formatted price string in INR (whole numbers, no decimals)
 */
export function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  } catch (error) {
    return `₹${Math.round(amount)}`;
  }
}

/**
 * Get currency symbol (always INR)
 * @returns Currency symbol for INR
 */
export function getCurrencySymbol(): string {
  return '₹';
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
