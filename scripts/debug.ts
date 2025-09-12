/* eslint-disable import/exports-last */
/* eslint-disable hypixelDiscordGuildChatBridge/enforce-no-console-log */
import ConfigManager from '../src/Config/ConfigManager';
import DataManager from '../src/Data/DataManager';
import { ConfigData, OsData, VersionsData } from '../src/Types/Debug';
import { arch, platform, release, type } from 'node:os';
import { execSync } from 'node:child_process';

function log(key: string, value: any) {
  if (typeof value === 'boolean') console.log(`**${key}**: \`${value ? 'Yes' : 'No'}\``);
  else console.log(`**${key}**: \`${value}\``);
}

export function getVersions(): VersionsData {
  return { node: process.version, pnpm: execSync('npm -v').toString().trim() };
}

export function getOsData(): OsData {
  return { platform: platform(), release: release(), type: type(), arch: arch() };
}

export async function getConfig(): Promise<ConfigData> {
  const base64 = ConfigManager.convertConfigToBase64();
  const form = new FormData();
  form.append('file', new Blob([base64], { type: 'text/plain' }), 'data.txt');
  const response = await fetch('https://0x0.st', {
    method: 'POST',
    body: form,
    headers: { 'User-Agent': 'curl/8.0.1' }
  });
  const url = await response.text();
  return { config: url };
}

(async () => {
  console.log('Git Data');
  Object.entries(await DataManager.getRepoData()).forEach((entry) => log(entry[0], entry[1]));
  console.log('\nVersions');
  Object.entries(getVersions()).forEach((entry) => log(entry[0], entry[1]));
  console.log('\nOs Data');
  Object.entries(getOsData()).forEach((entry) => log(entry[0], entry[1]));
  console.log('\nConfig');
  Object.entries(getConfig()).forEach((entry) => log(entry[0], entry[1]));
})();
