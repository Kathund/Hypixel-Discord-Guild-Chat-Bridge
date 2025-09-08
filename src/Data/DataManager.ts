import HypixelDiscordGuildBridgeError from '../Private/Error';
import ReplaceVariables from '../Private/ReplaceVariables';
import Translate from '../Private/Translate';
import zod from 'zod';
import { DataInstance, Dev, Devs, EmbedDefaultColor, EmbedDefaultColors } from '../types/main';
import { ExecException, exec } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const trackedData = [
  { name: 'Devs.json', default: {}, schema: zod.record(Devs, Dev) },
  { name: 'Colors.json', default: {}, schema: zod.record(EmbedDefaultColors, EmbedDefaultColor) }
];

class DataManager {
  trackedData: DataInstance[];
  constructor() {
    this.trackedData = trackedData;
    this.checkFiles();
  }

  checkFiles() {
    if (!existsSync('./data')) mkdirSync('./data/', { recursive: true });
    this.trackedData.forEach((data) => DataManager.checkFile(data));
  }

  static checkFile(data: DataInstance) {
    if (existsSync(`./data/${data.name}`)) {
      const file = readFileSync(`./data/${data.name}`);
      if (!file) {
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('data.error.missing'), { file: `data/${data.name}` })
        );
      }
      const fileData = JSON.parse(file.toString('utf8'));
      if (!fileData) {
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('data.error.malformed'), { file: `data/${data.name}` })
        );
      }
      if (Array.isArray(fileData) && fileData.length === 0) {
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('data.error.malformed'), { file: `data/${data.name}` })
        );
      }
      const parsed = data.schema.safeParse(fileData);
      if (!parsed.success) {
        console.error(parsed.error);
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('data.error.invalid'), { file: `data/${data.name}` })
        );
      }
    } else {
      throw new HypixelDiscordGuildBridgeError(
        ReplaceVariables(Translate('data.error.missing'), { file: `data/${data.name}` })
      );
    }
  }

  static getDevs(): Record<Devs, Dev> {
    const devsFile = readFileSync('./data/Devs.json');
    if (!devsFile) {
      throw new HypixelDiscordGuildBridgeError(
        ReplaceVariables(Translate('data.error.missing'), { file: 'data/Devs.json' })
      );
    }
    const devs = JSON.parse(devsFile.toString('utf8'));
    if (!devs) {
      throw new HypixelDiscordGuildBridgeError(
        ReplaceVariables(Translate('data.error.malformed'), { file: 'data/Devs.json' })
      );
    }
    return devs;
  }

  static getColors(): Record<EmbedDefaultColors, EmbedDefaultColor> {
    const colorsFile = readFileSync('./data/Colors.json');
    if (!colorsFile) {
      throw new HypixelDiscordGuildBridgeError(
        ReplaceVariables(Translate('data.error.missing'), { file: 'data/Colors.json' })
      );
    }
    const colors = JSON.parse(colorsFile.toString('utf8'));
    if (!colors) {
      throw new HypixelDiscordGuildBridgeError(
        ReplaceVariables(Translate('data.error.malformed'), { file: 'data/Colors.json' })
      );
    }
    return colors;
  }

  static getRepoData(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const data: string[] = [];
      exec('git remote get-url origin', (error: ExecException | null, stdout: string) => {
        if (error) return reject(error);
        if (!stdout.startsWith('https://github.com/')) return reject(new Error('Not a valid GitHub URL'));
        stdout
          .replaceAll('https://github.com/', '')
          .split('/')
          .forEach((key) => data.push(key));
        resolve(data);
      });
    });
  }

  static async updateDataFiles() {
    const repoData = await this.getRepoData();
    trackedData.forEach(async (file, index, array) => {
      try {
        console.other(ReplaceVariables(Translate('data.update.file'), { file: file.name }));
        const request = await fetch(
          `https://raw.githubusercontent.com/${repoData.join('/')}/refs/heads/main/data/${file.name}`
        );
        if (request.status === 404) throw new Error("File doesn't exist?");
        const text = await request.text();
        writeFileSync(`./data/${file.name}`, text);
        console.other(ReplaceVariables(Translate('data.update.file.updated'), { file: file.name }));
        DataManager.checkFile(file);
        console.other(ReplaceVariables(Translate('data.update.file.validate'), { file: file.name }));
        // eslint-disable-next-line hypixelDiscordGuildChatBridge/enforce-translate
        if (index !== array.length - 1) console.other('\n');
      } catch (error) {
        console.error(error);
      }
    });
  }
}

export default DataManager;
