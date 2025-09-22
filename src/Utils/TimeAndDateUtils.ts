import type { TimeLeftData } from '../Types/TimeAndDateUtils.js';

export function getSupportedTimezones(): string[] {
  const timezones = Intl.supportedValuesOf('timeZone');
  timezones.push('UTC');
  return timezones;
}

export function getUserTimezone(): string {
  const dateTime = Intl.DateTimeFormat();
  if (dateTime === undefined) return 'UTC';
  const foundTimezone = dateTime.resolvedOptions().timeZone;
  if (foundTimezone === undefined) return 'UTC';
  if (getSupportedTimezones().includes(foundTimezone)) return foundTimezone;
  return 'UTC';
}

export function TimeLeft(unixTimestamp: number): TimeLeftData {
  const now = Date.now();
  let diffSeconds = Math.floor(unixTimestamp * 1000 - now) / 1000;

  if (diffSeconds < 0) diffSeconds = 0;
  const days = Math.floor(diffSeconds / 86400);
  diffSeconds %= 86400;
  const hours = Math.floor(diffSeconds / 3600);
  diffSeconds %= 3600;
  const minutes = Math.floor(diffSeconds / 60);
  diffSeconds %= 60;
  const seconds = Math.floor(diffSeconds);

  return { days, hours, minutes, seconds };
}
