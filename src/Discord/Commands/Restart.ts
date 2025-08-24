import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import Embed from '../Private/Embed';
import Translate from '../../Private/Translate';
import type DiscordManager from '../DiscordManager';
import type { ChatInputCommandInteraction } from 'discord.js';

class RestartCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('restart');
  }

  // CREDITS: https://github.com/DuckySoLucky/hypixel-discord-chat-bridge/blob/2c4240c70a12f67937d5446adedf026970efcd60/src/discord/commands/restartCommand.js (modified)
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (this.discord.client === undefined) return;
    const restartingEmbed = new Embed()
      .setDev('georgeFilos')
      .setTitle(Translate('discord.commands.restart.execute.restarting.title'))
      .setDescription(Translate('discord.commands.restart.execute.restarting.description'));
    await interaction.followUp({ embeds: [restartingEmbed] });

    this.discord.Application.stop().then(() => this.discord.Application.connect());

    const restartedEmbed = new Embed()
      .setDev('georgeFilos')
      .setColorFromDefault('Green')
      .setTitle(Translate('discord.commands.restart.execute.restarted.title'))
      .setDescription(Translate('discord.commands.restart.execute.restarted.description'));
    await interaction.followUp({ embeds: [restartedEmbed] });
  }
}

export default RestartCommand;
