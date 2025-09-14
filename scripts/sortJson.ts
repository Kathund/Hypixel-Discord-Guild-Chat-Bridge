/* eslint-disable hypixelDiscordGuildChatBridge/enforce-no-console-log */
import { LoadFiles } from '../src/Utils/MiscUtils.js';
import { format } from 'prettier';
import { readFileSync, writeFileSync } from 'node:fs';
import { sortJSON } from '../src/Utils/JSONUtils.js';

const ignoredFolders = ['.git/', 'node_modules/', 'build/', 'minecraft-auth-cache/', 'logs/', 'data/config/'];
const ignoredFiles = ['package.json'];

const files = LoadFiles('./')
  .filter((file) => {
    let valid = true;
    for (const ignoredFolder of ignoredFolders) {
      if (valid === false) continue;
      if (`${file.slice(2)}/`.startsWith(ignoredFolder)) valid = false;
    }
    return valid;
  })
  .filter((file) => {
    let valid = true;
    for (const ignoredFile of ignoredFiles) {
      if (valid === false) continue;
      if (file.endsWith(ignoredFile)) valid = false;
    }
    return valid;
  })
  .filter((file) => file.endsWith('.json'));
const prettierConfig = JSON.parse(readFileSync('.prettierrc').toString('utf-8'));

(async () => {
  for (const file of files) {
    console.log(`Updating ${file}`);
    const fileData = readFileSync(file).toString('utf-8');
    const data = JSON.stringify(sortJSON(JSON.parse(fileData)));
    const formatted = await format(data, { ...prettierConfig, filepath: file });
    writeFileSync(file, formatted);
    console.log(`Updated ${file}\n`);
  }
})();
