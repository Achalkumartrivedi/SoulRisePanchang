import { parseTimeToMinutes } from './muhuratSafetyChecker';

/**
 * Checks if a target date is in the past (before 00:00:00 of today).
 */
export function isDateInPast(targetDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDate.getTime());
  target.setHours(0, 0, 0, 0);

  return target.getTime() < today.getTime();
}

/**
 * Checks if a target date is TODAY.
 */
export function isToday(targetDate: Date): boolean {
  const today = new Date();
  return (
    targetDate.getFullYear() === today.getFullYear() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getDate() === today.getDate()
  );
}

/**
 * Checks if a selected time string (e.g. "08:00 AM") on targetDate is in the past.
 */
export function isTimeInPastOnDate(targetDate: Date, timeStr: string): boolean {
  if (isDateInPast(targetDate)) {
    return true;
  }
  if (!isToday(targetDate)) {
    return false; // Future date is not in past
  }

  const now = new Date();
  const currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();
  const selectedMinutes = parseTimeToMinutes(timeStr);

  return selectedMinutes < currentMinutesFromMidnight;
}

/**
 * Returns the next upcoming time slot formatted as "HH:MM AM/PM".
 * If targetDate is TODAY, picks the next 30-minute window from current time.
 * If targetDate is in the FUTURE, defaults to "08:00 AM".
 */
export function getNextUpcomingTimeSlot(targetDate: Date = new Date()): string {
  if (!isToday(targetDate)) {
    return '08:00 AM';
  }

  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();

  // Round up to next 15/30 minute boundary
  if (m < 15) m = 15;
  else if (m < 30) m = 30;
  else if (m < 45) m = 45;
  else {
    m = 0;
    h = (h + 1) % 24;
  }

  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  let displayH = h % 12;
  if (displayH === 0) displayH = 12;

  const formattedH = displayH < 10 ? `0${displayH}` : `${displayH}`;
  const formattedM = m < 10 ? `0${m}` : `${m}`;

  return `${formattedH}:${formattedM} ${period}`;
}
