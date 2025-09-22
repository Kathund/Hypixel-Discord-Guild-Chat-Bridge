
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
