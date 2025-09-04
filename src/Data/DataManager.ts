import HypixelDiscordGuildBridgeError from '../Private/Error';
import ReplaceVariables from '../Private/ReplaceVariables';
import Translate from '../Private/Translate';
import zod from 'zod';
import { DataInstance, Dev, Devs } from '../types/main';
import { ExecException, exec } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

class DataManager {
  trackedData: DataInstance[];
  constructor() {
    this.trackedData = [{ name: 'Devs', default: {}, schema: zod.record(Devs, Dev) }];
    this.checkFiles();
  }

  checkFiles() {
    if (!existsSync('./data')) mkdirSync('./data/', { recursive: true });
    this.trackedData.forEach((data) => this.checkFile(data));
  }

  checkFile(data: DataInstance) {
    if (!existsSync(`./data/${data.name}.json`)) {
      writeFileSync(`./data/${data.name}.json`, JSON.stringify(data.default, null, 2));
    } else {
      const file = readFileSync('./data/Devs.json');
      if (!file) {
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('data.error.missing'), { file: `data/${data.name}.json` })
        );
      }
      const fileData = JSON.parse(file.toString('utf8'));
      if (!fileData) {
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('data.error.malformed'), { file: `data/${data.name}.json` })
        );
      }
      const parsed = data.schema.safeParse(fileData);
      if (!parsed.success) {
        console.error(parsed.error);
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('data.error.invalid'), { file: `data/${data.name}.json` })
        );
      }
    }
  }

  getDevs(): Record<Devs, Dev> {
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

  private getRepoData(): Promise<string[]> {
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

  async updateDataFiles() {
    const repoData = await this.getRepoData();
    this.trackedData.forEach(async (file, index, array) => {
      try {
        console.other(ReplaceVariables(Translate('data.update.file'), { file: file.name }));
        const request = await fetch(
          `https://raw.githubusercontent.com/${repoData.join('/')}/refs/heads/main/data/${file.name}`
        );
        if (request.status === 404) throw new Error("File doesn't exist?");
        const text = await request.text();
        writeFileSync(`./data/${file.name}`, text);
        console.other(ReplaceVariables(Translate('data.update.file.updated'), { file: file.name }));
        this.checkFile(file);
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
