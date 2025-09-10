/* eslint-disable import/exports-last */
/* eslint-disable hypixelDiscordGuildChatBridge/enforce-no-console-log */
import DataManager from '../src/Data/DataManager';
import { OsData, VersionsData } from '../src/types/Debug';
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

(async () => {
  console.log('Git Data');
  Object.entries(await DataManager.getRepoData()).forEach((entry) => log(entry[0], entry[1]));
  console.log('\nVersions');
  Object.entries(getVersions()).forEach((entry) => log(entry[0], entry[1]));
  console.log('\nOs Data');
  Object.entries(getOsData()).forEach((entry) => log(entry[0], entry[1]));
})();
