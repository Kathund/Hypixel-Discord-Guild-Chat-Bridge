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

export function ReplaceVariables(template: string, variables: object): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return template.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);
}

export function splitMessage(message: string, amount: number): string[] {
  const messages = [];
  for (let i = 0; i < message.length; i += amount) {
    messages.push(message.slice(i, i + amount));
  }
  return messages;
}
