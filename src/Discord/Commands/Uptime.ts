import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import type DiscordManager from '../DiscordManager';
import type { ChatInputCommandInteraction } from 'discord.js';

class UptimeCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('uptime');
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const time = Math.floor((Date.now() - interaction.client.uptime) / 1000);
    await interaction.followUp({ content: ReplaceVariables(Translate('discord.commands.uptime.execute'), { time }) });
  }
}

export default UptimeCommand;
