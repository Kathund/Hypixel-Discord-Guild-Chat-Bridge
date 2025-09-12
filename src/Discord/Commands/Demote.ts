import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import HypixelDiscordGuildBridgeError from '../../Private/Error.js';
import ReplaceVariables from '../../Private/ReplaceVariables.js';
import Translate from '../../Private/Translate.js';
import { ChatInputCommandInteraction, SlashCommandStringOption } from 'discord.js';
import { SuccessEmbed } from '../Private/Embed.js';
import type { DiscordManagerWithBot } from '../../Types/Discord.js';

class DemoteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName('demote')
      .addStringOption(new SlashCommandStringOption().setName('username').setRequired(true))
      .addGroup('minecraft');
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
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
