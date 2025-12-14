import { readdirSync, statSync } from 'node:fs';

// Credit - https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/d3ea84a26ebf094c8191d50b4954549e2dd4dc7f/src/contracts/helperFunctions.js#L251-L258
// eslint-disable-next-line require-await
export async function Delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Credit - https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/d3ea84a26ebf094c8191d50b4954549e2dd4dc7f/src/contracts/helperFunctions.js#L25-L39
export function GenerateId(length: number): string {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function LoadFiles(dir = './'): string[] {
  const paths = [];
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = `${dir}/${file}`.replaceAll('//', '/');
    if (statSync(fullPath).isDirectory()) {
      LoadFiles(fullPath).forEach((path) => paths.push(path));
    } else {
      paths.push(fullPath);
    }
  }
  return paths;
}

// Credit - https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/d3ea84a26ebf094c8191d50b4954549e2dd4dc7f/src/contracts/helperFunctions.js#L242-L249
export function FormatError(error: Error): string {
  return error
    .toString()
    .replace('[hypixel-api-reborn] ', '')
    .replace('For help join our Discord Server https://discord.gg/NSEBNMM', '')
    .replace('Error:', '[ERROR]');
}
