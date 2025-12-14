// Credit - https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/d3ea84a26ebf094c8191d50b4954549e2dd4dc7f/src/contracts/helperFunctions.js#L260-L278
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

// Credit - https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/d3ea84a26ebf094c8191d50b4954549e2dd4dc7f/src/contracts/helperFunctions.js#L216-L225
export function ReplaceVariables(template: string, variables: object): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return template.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);
}

// Credit - https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/d3ea84a26ebf094c8191d50b4954549e2dd4dc7f/src/contracts/helperFunctions.js#L227-L240
export function SplitMessage(message: string, amount: number): string[] {
  const messages = [];
  for (let i = 0; i < message.length; i += amount) {
    messages.push(message.slice(i, i + amount));
  }
  return messages;
}

// Credit - https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/d3ea84a26ebf094c8191d50b4954549e2dd4dc7f/src/contracts/helperFunctions.js#L178-L190
export function FormatUsername(username: string, gamemode: string | null): string {
  if (!gamemode) return username;
  if (gamemode === 'ironman') return `♲ ${username}`;
  if (gamemode === 'bingo') return `Ⓑ ${username}`;
  if (gamemode === 'island') return `☀ ${username}`;

  return username;
}

// Credit - https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/d3ea84a26ebf094c8191d50b4954549e2dd4dc7f/src/contracts/helperFunctions.js#L192-L214
export function FormatNumber(number: number, decimals: number = 2): string {
  if (number === undefined || number === 0) return '0';

  const isNegative = number < 0;

  if (number < 100000 && number > -100000) {
    return Number(number).toLocaleString();
  }

  const abbrev = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'S', 'O', 'N', 'D'];
  const unformattedNumber = Math.abs(number);

  const abbrevIndex = Math.floor(Math.log10(unformattedNumber) / 3);
  const shortNumber = (unformattedNumber / Math.pow(10, abbrevIndex * 3)).toFixed(decimals);

  return `${isNegative ? '-' : ''}${shortNumber}${abbrev[abbrevIndex]}`;
}
