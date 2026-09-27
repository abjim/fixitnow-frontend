import { format } from 'date-fns';

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function taka(amount: number) {
  return `৳${Math.round(amount).toLocaleString('en-US')}`;
}

export function dateTime(iso: string) {
  return format(new Date(iso), 'd MMM yyyy, h:mm a');
}

export function dateOnly(iso: string) {
  return format(new Date(iso), 'd MMM yyyy');
}

export function duration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hr` : `${hours.toFixed(1)} hr`;
}
