import { TZDate } from '@date-fns/tz';
import { format, isSameDay, subDays } from 'date-fns';

export function toUtcIsoString(date: Date): string {
  return date.toISOString();
}

export function localToUtc(localDate: Date, timeZoneId: string): Date {
  const tzDate = new TZDate(
    localDate.getFullYear(), localDate.getMonth(), localDate.getDate(),
    localDate.getHours(), localDate.getMinutes(), localDate.getSeconds(),
    timeZoneId
  );
  return new Date(tzDate.getTime());
}

export function utcToLocalDate(utcString: string, timeZoneId: string): Date {
  return new TZDate(utcString, timeZoneId);
}

export function formatLocalDate(utcString: string, fmt: string, timeZoneId: string): string {
  return format(new TZDate(utcString, timeZoneId), fmt);
}

export function getLocalDateKey(utcString: string, timeZoneId: string): string {
  return format(new TZDate(utcString, timeZoneId), 'yyyy-MM-dd');
}

export function isTodayInZone(utcString: string, timeZoneId: string): boolean {
  return isSameDay(new TZDate(utcString, timeZoneId), new TZDate(new Date(), timeZoneId));
}

export function isYesterdayInZone(utcString: string, timeZoneId: string): boolean {
  const now = new TZDate(new Date(), timeZoneId);
  return isSameDay(new TZDate(utcString, timeZoneId), subDays(now, 1));
}
