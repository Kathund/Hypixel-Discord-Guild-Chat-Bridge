import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import Translate from '../../Private/Translate.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type DiscordManager from '../DiscordManager.js';
import type { ChatInputCommandInteraction } from 'discord.js';

class UptimeCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('uptime');
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const time = Math.floor((Date.now() - interaction.client.uptime) / 1000);
    await interaction.followUp({ content: ReplaceVariables(Translate('discord.commands.uptime.execute'), { time }) });
  }
}

export default UptimeCommand;
