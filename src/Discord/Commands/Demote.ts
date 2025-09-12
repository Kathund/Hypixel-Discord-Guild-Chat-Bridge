import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import HypixelDiscordGuildBridgeError from '../../Private/Error';
import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import { ChatInputCommandInteraction, SlashCommandStringOption } from 'discord.js';
import { SuccessEmbed } from '../Private/Embed';
import type { DiscordManagerWithBot } from '../../Types/Discord';

class DemoteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName('demote')
      .addStringOption(new SlashCommandStringOption().setName('username').setRequired(true))
      .addGroup('minecraft');
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString(Translate(`discord.commands.${this.data.name}.options.username`));
    if (!username) {
      throw new HypixelDiscordGuildBridgeError(
        Translate(`discord.commands.${this.data.name}.options.username.missing`)
      );
    }
    this.discord.Application.minecraft.bot.chat(`/g demote ${username}`);
    await interaction.followUp({
      embeds: [
        new SuccessEmbed(
          ReplaceVariables(Translate(`discord.commands.${this.data.name}.execute.success`), { username })
        )
      ]
    });
  }
}

export default DemoteCommand;
