import { readdirSync, statSync } from 'node:fs';

// eslint-disable-next-line require-await
export async function Delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

export function FormatError(error: Error): string {
  return error
    .toString()
    .replace('[hypixel-api-reborn] ', '')
    .replace('For help join our Discord Server https://discord.gg/NSEBNMM', '')
    .replace('Error:', '[ERROR]');
}
