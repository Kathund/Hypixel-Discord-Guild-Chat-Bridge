import Translate from '../../Private/Translate.js';
import type DiscordManager from '../DiscordManager.js';
import type ScriptData from './ScriptData.js';

class Script {
  readonly discord: DiscordManager;
  data!: ScriptData;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  execute(): Promise<void> | void {
    throw new Error(Translate('discord.scripts.error.missingExecute'));
  }
}

export default Script;
