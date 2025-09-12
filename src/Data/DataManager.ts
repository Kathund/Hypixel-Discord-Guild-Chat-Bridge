import HypixelDiscordGuildBridgeError from '../Private/Error';
import ReplaceVariables from '../Private/ReplaceVariables';
import Translate from '../Private/Translate';
import zod from 'zod';
import { DataInstance, Dev, Devs } from '../Types/Data';
import { EmbedDefaultColor, EmbedDefaultColors } from '../Types/Discord';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { RepoData } from '../Types/Debug';

const trackedData = [
  { name: 'Devs.json', default: {}, schema: zod.record(Devs, Dev) },
  { name: 'Colors.json', default: {}, schema: zod.record(EmbedDefaultColors, EmbedDefaultColor) }
];

class DataManager {
  static checkFiles() {
    if (!existsSync('./data')) mkdirSync('./data/', { recursive: true });
    trackedData.forEach((data) => DataManager.checkFile(data));
  }

  static checkFile(data: DataInstance) {
    console.other(ReplaceVariables(Translate('data.validate.file'), { file: data.name }));
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
      console.other(ReplaceVariables(Translate('data.validate.file.complete'), { file: data.name }));
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

  static async getRepoData(): Promise<RepoData> {
    const data: RepoData = {
      commit: 'UNKNOWN',
      branch: 'UNKNOWN',
      isMainBranch: false,
      repoOwner: 'UNKNOWN',
      repoName: 'UNKNOWN',
      isOnLatestCommit: false
    };
    const remoteUrl = execSync('git remote get-url origin').toString().trim();
    if (!remoteUrl.startsWith('https://github.com/')) {
      throw new Error('Not a valid GitHub URL');
    }
    const repoInfo = remoteUrl.replace('https://github.com/', '').split('/');
    if (repoInfo.length === 2) {
      data.repoOwner = repoInfo[0];
      data.repoName = repoInfo[1].replace(/\.git$/, '');
    }
    data.branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    data.isMainBranch = data.branch === 'main';
    data.commit = execSync('git rev-parse HEAD').toString().trim();
    const commits = await fetch('https://api.github.com/repos/kathund/Hypixel-Discord-Guild-Chat-Bridge/commits');
    if (commits.status !== 200) throw new Error('Something went wrong while fetching the commits.');
    const parsed = await commits.json();
    data.isOnLatestCommit = parsed[0].sha === data.commit;
    return data;
  }

  static async updateDataFiles() {
    const repoData = await this.getRepoData();
    trackedData.forEach(async (file) => {
      try {
        console.other(ReplaceVariables(Translate('data.update.file'), { file: file.name }));
        const request = await fetch(
          `https://raw.githubusercontent.com/${repoData.repoOwner}/${repoData.repoName}/refs/heads/main/data/${file.name}`
        );
        if (request.status === 404) throw new Error("File doesn't exist?");
        const text = await request.text();
        writeFileSync(`./data/${file.name}`, text);
        console.other(ReplaceVariables(Translate('data.update.file.updated'), { file: file.name }));
      } catch (error) {
        console.error(error);
      }
    });
  }
}

export default DataManager;
