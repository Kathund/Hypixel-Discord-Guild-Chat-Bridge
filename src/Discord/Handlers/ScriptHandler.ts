import Translate from '../../Private/Translate.js';
import { Collection } from 'discord.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import { readdirSync } from 'node:fs';
import type DiscordManager from '../DiscordManager.js';
import type Script from '../Private/Script.js';
import type { SubConfigConfigJSON } from '../../Types/Configs.js';

class ScriptHandler {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async deployScripts(): Promise<void> {
    if (!this.discord.isDiscordOnline()) return;
    const scriptFiles = readdirSync('./src/Discord/Scripts');
    const scriptConfig = this.discord.Application.config.discord.getValue('scripts');
    if (!scriptConfig || !scriptConfig.isSubConfigConfig()) return;
    this.discord.client.scripts = new Collection<string, NodeJS.Timeout>();

    for (const file of scriptFiles) {
      const script: Script = new (await import(`../Scripts/${file}`)).default(this.discord);
      if (!script.data) continue;
      const scriptConfigOption = scriptConfig.getValue()?.[script.data.getName()] as SubConfigConfigJSON | undefined;
      if (!scriptConfigOption?.value?.enabled?.value) continue;
      this.discord.client.scripts.set(
        script.data.getName(),
        setInterval(() => script.execute(), ((scriptConfigOption?.value?.refresh?.value as number) || 1) * 60 * 1000)
      );
    }
    console.discord(
      ReplaceVariables(Translate('discord.scripts.load.finished'), { amount: this.discord.client.scripts.size })
    );
  }

  stopScripts(): void {
    if (!this.discord.isDiscordOnline()) return;
    this.discord.client.scripts.forEach((timeout) => {
      clearInterval(timeout);
    });
    this.discord.client.scripts.clear();
  }
}

export default ScriptHandler;
