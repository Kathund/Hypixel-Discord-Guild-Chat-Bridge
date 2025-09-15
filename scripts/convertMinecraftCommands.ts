/* eslint-disable hypixelDiscordGuildChatBridge/enforce-no-console-log */
import { TitleCase } from '../src/Utils/StringUtils.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { format } from 'prettier';
import { getTranslations } from '../src/Private/Translate.js';

if (!existsSync('./scripts/fixed')) mkdirSync('./scripts//fixed', { recursive: true });

async function getCommands(): Promise<{ name: string; content: string }[]> {
  const request = await fetch(
    'https://api.github.com/repos/duckysolucky/hypixel-discord-chat-bridge/contents/src/minecraft/commands'
  );
  if (request.status !== 200) throw new Error('Something went wrong while fetching the commands.');
  const parsed: { name: string; download_url: string }[] = await request.json();
  const fixed = parsed.filter((file) => file.name.endsWith('Command.js'));
  const files = [];
  for (const file of fixed) {
    const fileDataRequest = await fetch(file.download_url);
    if (fileDataRequest.status !== 200) throw new Error('Something went wrong while fetching the commands.');
    const fileData = await fileDataRequest.text();
    files.push({ name: file.name, content: fileData });
  }
  return files;
}

const prettierConfig = JSON.parse(readFileSync('.prettierrc').toString('utf-8'));
const translations = getTranslations('en_us');

(async () => {
  const files = await getCommands();
  console.log(`Loaded ${files.length}`);
  for (const fileData of files) {
    const fileName = fileData.name;
    const fixedPath = `./src/Minecraft/Commands/${TitleCase(fileName.replaceAll('Command.js', ''))}.ts`;
    console.log(`Fixing ${fileName}`);

    const fileContent = await format(fileData.content, { ...prettierConfig, filepath: fileName });
    const transformed = fileContent
      .replace(/const\s+(\w+)\s*=\s*require\(['"](.+?)['"]\);?/g, `import $1 from '$2';`)
      .replace(/const\s+{([^}]+)}\s*=\s*require\(['"](.+?)['"]\);?/g, `import { $1 } from '$2';`)
      .replace(/module\.exports\s*=\s*/g, 'export default ')
      .replace(/exports\.(\w+)\s*=\s*/g, 'export const $1 = ')
      .replaceAll('  /**\n   * @param {string} player\n   * @param {string} message\n   * */', '')
      .replaceAll('async onCommand(player, message) {', 'override async execute(player: string, message: string) {')
      .replaceAll("import minecraftCommand from '../../contracts/minecraftCommand.js';", '')
      .replaceAll('/** @param {import("minecraft-protocol").Client} minecraft */', '')
      .replaceAll('minecraftCommand', 'Command')
      .replaceAll('constructor(minecraft) {', 'constructor(minecraft: MinecraftManagerWithBot) {')
      .replaceAll(
        "import hypixel from '../../contracts/API/HypixelRebornAPI.js';",
        "import hypixel from '../../Private/HypixelAPIReborn.js';"
      )
      .replaceAll('bot.chat(', 'this.minecraft.bot.chat(')
      .replaceAll('formatNumber', 'FormatNumber')
      .replaceAll('titleCase', 'TitleCase');

    const fixedLines = [
      "import Command from '../Private/Command.js';",
      "import CommandData from '../Private/CommandData.js';",
      "import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';",
      "import CommandDataOption from '../Private/CommandDataOption.js';"
    ];

    let commandData = 'this.data = new CommandData()';
    let commandName = 'MISSING';

    const split = transformed.split('\n');
    for (const line of split) {
      if (line.startsWith("    this.name = '") && line.endsWith("';")) {
        commandName = line.replaceAll('    this.name = ', '').replaceAll(';', '').replaceAll("'", '');
        commandData += `.setName('${commandName}')`;
        translations[`minecraft.commands.${commandName}`] = commandName;
      } else if (line.startsWith("    this.description = '") && line.endsWith("';")) {
        translations[`minecraft.commands.${commandName}.description`] = line
          .replaceAll('    this.description = ', '')
          .replaceAll(';', '')
          .replaceAll("'", '');
      } else if (line.startsWith('    this.aliases = [') && line.endsWith('];')) {
        commandData += line.replaceAll('    this.aliases = ', '.setAliases(').replaceAll(';', '');
        commandData += ')';
      } else if (line.startsWith('    this.options = [') && line.endsWith('];')) {
        const options = JSON.parse(
          line
            .replace('    this.options = ', '')
            .replace(/;$/, '')
            .replace(/(\w+):/g, '"$1":')
            .replace(/'/g, '"')
        ) as { name: string; description: string; required: boolean }[];
        commandData += `.setOptions([${options
          .map(
            (option) =>
              `new CommandDataOption().setName(${JSON.stringify(
                option.name
              )}).setDescription(${JSON.stringify(option.description)}).setRequired(${option.required})`
          )
          .join(', ')}])`;
      } else {
        fixedLines.push(line);
      }
    }

    const finishedContent = fixedLines.join('\n').replaceAll('super(minecraft);', `super(minecraft);\n${commandData}`);

    writeFileSync(fixedPath, finishedContent, 'utf-8');
    const formatted = await format(finishedContent, { ...prettierConfig, filepath: fixedPath });
    writeFileSync(fixedPath, formatted, 'utf-8');

    console.log(`Saved ${fixedPath}\n`);
  }

  const translationsString = JSON.stringify(translations);
  const translationsFormatted = await format(translationsString, {
    ...prettierConfig,
    filepath: './translations/en_us.json'
  });

  writeFileSync('./translations/en_us.json', translationsFormatted);
})();
