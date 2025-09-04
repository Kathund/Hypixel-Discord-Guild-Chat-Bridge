import Translate from '../../Private/Translate';
import type CommandData from './CommandData';
import type DiscordManager from '../DiscordManager';
import type { ChatInputCommandInteraction } from 'discord.js';

class Command {
  readonly discord: DiscordManager;
  data!: CommandData;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  execute(interaction: ChatInputCommandInteraction): Promise<void> | void {
    throw new Error(Translate('discord.commands.error.missingExecute'));
  }
}

export default Command;
