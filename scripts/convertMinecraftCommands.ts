/* eslint-disable hypixelDiscordGuildChatBridge/enforce-translate */
import Translate, { getTranslations } from '../src/Private/Translate.js';
import { ReplaceVariables, TitleCase } from '../src/Utils/StringUtils.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { format } from 'prettier';

console.other = console.log;

const args: string[] = process.argv.slice(2);
let writtenFiles = 0;
let maxWrittenFiles = 1000;

const maxIndex = args.indexOf('--max');
if (maxIndex !== -1) {
  const value = args[maxIndex + 1];
  if (value !== undefined) {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      maxWrittenFiles = parsed;
    } else {
      console.error(ReplaceVariables(Translate('scripts.convert.minecraft.commands.execute.error.value'), { value }));
      process.exit(1);
    }
  }
}

if (maxWrittenFiles !== 1000) {
  console.other(
    ReplaceVariables(Translate('scripts.convert.minecraft.commands.execute.max.files'), { maxWrittenFiles })
  );
}

if (!existsSync('./scripts/fixed')) mkdirSync('./scripts/fixed', { recursive: true });

async function getCommands(): Promise<{ name: string; content: string }[]> {
  const request = await fetch(
    'https://api.github.com/repos/duckysolucky/hypixel-discord-chat-bridge/contents/src/minecraft/commands'
  );
  if (request.status !== 200) {
    throw new Error(Translate('scripts.convert.minecraft.commands.execute.error.fetch.commands'));
  }
  const parsed: { name: string; download_url: string }[] = await request.json();
  const fixed = parsed.filter((file) => file.name.endsWith('Command.js'));
  const files = [];
  for (const file of fixed) {
    const fileDataRequest = await fetch(file.download_url);
    if (fileDataRequest.status !== 200) {
      throw new Error(Translate('scripts.convert.minecraft.commands.execute.error.fetch.commands'));
    }
    const fileData = await fileDataRequest.text();
    files.push({ name: file.name, content: fileData });
  }
  return files;
}

const prettierConfig = JSON.parse(readFileSync('.prettierrc').toString('utf-8'));
const translations = getTranslations('en_us');

const skipped = [
  'Auctionhouse',
  'Bedwarsstats',
  'Chicken',
  'Chocolate',
  'Crimsonisle',
  'Dinosaur',
  'Duck',
  'Duelsstats',
  'Fetcher',
  'Guildexperience',
  'Kitty',
  'Picket',
  'Quickmaths',
  'Rabbit',
  'Renderarmor',
  'Renderequipment',
  'Renderitem',
  'Renderpet',
  'Skywarsstats',
  'Specialmayor',
  'Unscramble',
  'Fairysouls',
  'Fetchur',
  'Mayor',
  'Megawalls',
  'Networth',
  'Personalbest',
  'Raccoon',
  'Skyblocklevel',
  'Trophyfish'
];

(async () => {
  const files = await getCommands();
  console.other(
    ReplaceVariables(Translate('scripts.convert.minecraft.commands.execute.load'), { amount: files.length })
  );
  for (const fileData of files) {
    const fileName = fileData.name;
    const title = TitleCase(fileName.replaceAll('Command.js', ''));
    const fixedPath = `./src/Minecraft/Commands/${title}.ts`;
    console.other(ReplaceVariables(Translate('scripts.convert.minecraft.commands.execute.fix'), { fileName }));

    if (skipped.includes(title)) {
      console.other(Translate('scripts.convert.minecraft.commands.execute.skip.ignored'));
      console.other('\n');
      continue;
    }

    if (existsSync(fixedPath)) {
      console.other(Translate('scripts.convert.minecraft.commands.execute.skip.already.exist'));
      console.other('\n');
      continue;
    }

    if (writtenFiles >= maxWrittenFiles) {
      console.other(Translate('scripts.convert.minecraft.commands.execute.skip.max'));
      console.other('\n');
      continue;
    }

    const fileContent = await format(fileData.content, { ...prettierConfig, filepath: fileName });
    /* eslint-disable @stylistic/max-len */
    const transformed = fileContent
      .replace(/const\s+(\w+)\s*=\s*require\(['"](.+?)['"]\);?/g, "import $1 from '$2';")
      .replace(/const\s+{([^}]+)}\s*=\s*require\(['"](.+?)['"]\);?/g, "import { $1 } from '$2';")
      .replace(/module\.exports\s*=\s*/g, 'export default ')
      .replace(/exports\.(\w+)\s*=\s*/g, 'export const $1 = ')
      .replaceAll('  /**\n   * @param {string} player\n   * @param {string} message\n   * */', '')
      .replaceAll('async onCommand(player, message) {', 'override async execute(player: string, message: string) {')
      .replaceAll("import minecraftCommand from '../../contracts/minecraftCommand.js';", '')
      .replaceAll('/** @param {import("minecraft-protocol").Client} minecraft */', '')
      .replaceAll('// CREDITS: by @Kathund (https://github.com/Kathund)', '')
      .replaceAll('minecraftCommand', 'Command')
      .replaceAll('constructor(minecraft) {', 'constructor(minecraft: MinecraftManagerWithBot) {')
      .replaceAll(
        "import hypixel from '../../contracts/API/HypixelRebornAPI.js';",
        "import HypixelAPIReborn from '../../Private/HypixelAPIReborn.js';"
      )
      .replaceAll('hypixel.', 'HypixelAPIReborn.')
      .replaceAll('this.send(FormatError(error));', 'if (error instanceof Error) this.send(FormatError(error));')
      .replaceAll('bot.chat(', 'this.minecraft.bot.chat(')
      .replaceAll('formatNumber', 'FormatNumber')
      .replaceAll('titleCase', 'TitleCase')
      .replaceAll('formatError', 'FormatError')
      .replaceAll(
        "import {  FormatNumber, TitleCase  } from '../../contracts/helperFunctions.js';",
        "import { FormatNumber, TitleCase } from '../../Utils/StringUtils.js';"
      )
      .replaceAll(
        "import {  FormatNumber, FormatError, TitleCase  } from '../../contracts/helperFunctions.js';",
        "import { FormatNumber, TitleCase } from '../../Utils/StringUtils.js';\nimport { FormatError } from '../../Utils/MiscUtils.js';;"
      )
      .replaceAll(
        "import {  getLatestProfile  } from '../../../API/functions/getLatestProfile.js';",
        "import { getLatestProfile } from '../../Utils/HypixelUtils.js';"
      )
      .replaceAll(
        "import {  FormatError  } from '../../contracts/helperFunctions.js';",
        "import { FormatError } from '../../Utils/MiscUtils.js';;"
      )
      .replaceAll(
        "import {  TitleCase  } from '../../contracts/helperFunctions.js';",
        "import { TitleCase } from '../../Utils/MiscUtils.js';;"
      )
      .replaceAll(
        "import {  FormatNumber, delay, TitleCase  } from '../../contracts/helperFunctions.js';",
        "import { FormatNumber, TitleCase } from '../../Utils/StringUtils.js';\nimport { Delay } from '../../Utils/MiscUtils.js';"
      )
      .replaceAll(
        "import {  FormatNumber, FormatError  } from '../../contracts/helperFunctions.js';",
        "import { FormatNumber } from '../../Utils/StringUtils.js';\nimport { FormatError } from '../../Utils/MiscUtils.js';"
      )
      .replaceAll(
        "import {  FormatNumber  } from '../../contracts/helperFunctions.js';",
        "import { FormatNumber } from '../../Utils/StringUtils.js';"
      )
      .replaceAll(
        "import {  delay  } from '../../contracts/helperFunctions.js';",
        "import { Delay } from '../../Utils/MiscUtils.js';"
      )
      .replaceAll(
        'const { username, profile } = await getLatestProfile(player);',
        'const profile = await getLatestProfile(player);\nconst username = FormatUsername(player, profile.gameMode);'
      )
      .replaceAll(
        'const { username, profile, profileData } = await getLatestProfile(player);',
        'const profile = await getLatestProfile(player);\nconst username = FormatUsername(player, profile.gameMode);'
      );
    /* eslint-enable @stylistic/max-len */

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
        const desc = line.replaceAll('    this.description = ', '').replaceAll(';', '').replaceAll("'", '');
        translations[`minecraft.commands.${commandName}.description`] = desc;
        translations[`config.options.minecraft.commands.${commandName}.description`] = desc;
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
        options.forEach((option) => {
          translations[`minecraft.commands.${commandName}.${option.name}`] = TitleCase(option.name);
          translations[`minecraft.commands.${commandName}.${option.name}.description`] = TitleCase(option.description);
        });
        commandData += `.setOptions([${options
          .map(
            (option) =>
              `new CommandDataOption().setName(${JSON.stringify(option.name)}).setRequired(${option.required})`
          )
          .join(', ')}])`;
      } else {
        fixedLines.push(line);
      }
    }

    translations[`config.options.minecraft.commands.${commandName}`] = TitleCase(commandName);
    translations[`config.options.minecraft.commands.${commandName}.enabled`] = 'Enable';
    translations[`config.options.minecraft.commands.${commandName}.enabled.description`] = 'Enable the command';
    translations[`config.options.minecraft.commands.${commandName}.open`] = `Open ${TitleCase(commandName)} Config`;

    const finishedContent = fixedLines
      .join('\n')
      .replaceAll('super(minecraft);', `super(minecraft);\n${commandData}`)
      .replaceAll('.setAliases([])', '')
      .replaceAll('.setAliases([]);', '')
      .replaceAll('.setOptions([])', '')
      .replaceAll('.setOptions([]);', '');

    writeFileSync(fixedPath, finishedContent, 'utf-8');
    const formatted = await format(finishedContent, { ...prettierConfig, filepath: fixedPath });
    writeFileSync(fixedPath, formatted, 'utf-8');

    writtenFiles++;
    console.other(ReplaceVariables(Translate('scripts.convert.minecraft.commands.execute.save'), { fixedPath }));
  }

  const translationsString = JSON.stringify(translations);
  const translationsFormatted = await format(translationsString, {
    ...prettierConfig,
    filepath: './translations/en_us.json'
  });

  writeFileSync('./translations/en_us.json', translationsFormatted);
})();
