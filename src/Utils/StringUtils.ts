export function TitleCase(string: string): string {
  if (!string) return '';
  return string
    .toLowerCase()
    .replaceAll('_', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function CleanMessageForDiscord(string: string): string {
  if (!string) return '';
  return string
    .replaceAll('_', '\\_')
    .replaceAll('*', '\\*')
    .replaceAll('~', '\\~')
    .replaceAll('>', '\\>')
    .replaceAll('`', '\\`')
    .replaceAll('|', '\\|');
}
