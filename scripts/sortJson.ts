/* eslint-disable hypixelDiscordGuildChatBridge/enforce-no-console-log */
import { format } from 'prettier';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { sortJSON } from '../src/Utils/JSONUtils.js';

const ignoredFolders = ['.git/', 'node_modules/', 'build/', 'minecraft-auth-cache/', 'logs/', 'data/config/'];
const ignoredFiles = ['package.json'];

function loadFiles(dir = './'): string[] {
  const paths = [];
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = `${dir}/${file}`.replaceAll('//', '/');
    if (statSync(fullPath).isDirectory()) {
      let valid = true;
      for (const ignore of ignoredFolders) {
        if (valid === false) continue;
        if (`${fullPath.slice(2)}/`.startsWith(ignore)) valid = false;
      }
      if (valid) loadFiles(fullPath).forEach((path) => paths.push(path));
    } else {
      let valid = true;
      for (const ignoredFile of ignoredFiles) {
        if (valid === false) continue;
        if (fullPath.endsWith(ignoredFile)) valid = false;
      }
      if (valid) paths.push(fullPath);
    }
  }
  return paths;
}

const files = loadFiles().filter((file) => file.endsWith('.json'));
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
