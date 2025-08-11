/* eslint-disable import/prefer-default-export */
export function TitleCase(string: string) {
  if (!string) return '';
  return string
    .toLowerCase()
    .replaceAll('_', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
