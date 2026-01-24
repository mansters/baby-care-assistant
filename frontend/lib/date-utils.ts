import { format, parseISO } from 'date-fns';

/**
 * Formats a date string (ISO UTC) to local display format.
 * @param dateString ISO string from backend (UTC)
 * @param fmtString Format string (default: 'yyyy-MM-dd HH:mm')
 */
export const formatLocal = (dateString: string, fmtString: string = 'yyyy-MM-dd HH:mm'): string => {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), fmtString);
  } catch (e) {
    console.error('Invalid date string:', dateString);
    return '-';
  }
};

/**
 * Converts a local Date object or string to ISO UTC string for storage.
 * @param date Date object or date string
 */
export const toUTCISO = (date: Date | string): string => {
  return new Date(date).toISOString();
};

/**
 * GET current local time formatted for datetime-local input (YYYY-MM-DDTHH:mm)
 */
export const getCurrentLocalForInput = (): string => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};
