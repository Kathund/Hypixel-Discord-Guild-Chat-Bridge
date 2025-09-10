import Translate from '../../Private/Translate';
import type CommandData from './CommandData';
import type DiscordManager from '../DiscordManager';
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
