import Translate from '../../Private/Translate.js';
import type CommandData from './CommandData.js';
import type DiscordManager from '../DiscordManager.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { DiscordManagerWithClient } from '../../Types/Discord.js';

class Command<T extends DiscordManager = DiscordManagerWithClient> {
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
