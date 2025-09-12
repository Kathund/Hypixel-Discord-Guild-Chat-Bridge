import Translate from '../../Private/Translate.js';
import type CommandData from './CommandData.js';
import type DiscordManager from '../DiscordManager.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class Command<T extends DiscordManager = DiscordManager> {
  readonly discord: T;
  data!: CommandData;
  constructor(discord: T) {
    this.discord = discord;
  }

  execute(interaction: ChatInputCommandInteraction): Promise<void> | void {
    throw new Error(Translate('discord.commands.error.missingExecute'));
  }
}

export default Command;
