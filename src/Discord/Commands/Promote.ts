import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import HypixelDiscordGuildBridgeError from '../../Private/Error';
import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate, { unTranslate } from '../../Private/Translate';
import { ChatInputCommandInteraction, SlashCommandStringOption } from 'discord.js';
import { SuccessEmbed } from '../Private/Embed';
import type { DiscordManagerWithBot } from '../../types/Discord';

class PromoteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName('promote')
      .addStringOption(new SlashCommandStringOption().setName('username').setRequired(true))
      .addGroup('minecraft');
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.discord.Application.minecraft.isBotOnline()) {
      throw new HypixelDiscordGuildBridgeError(Translate('minecraft.error.botOffline'));
    }
    const username = interaction.options.getString(Translate(`discord.commands.${this.data.name}.options.username`));
    if (!username) {
      throw new HypixelDiscordGuildBridgeError(
        Translate(`discord.commands.${this.data.name}.options.username.missing`)
      );
    }

    this.discord.minecraftCommandData = { name: Translate(unTranslate(this.data.name), 'en_us'), interaction };
    setTimeout(() => {
      this.discord.minecraftCommandData = undefined;
    }, 5000);

    this.discord.Application.minecraft.bot.chat(`/g promote ${username}`);
    await interaction.followUp({
      embeds: [
        new SuccessEmbed(
          ReplaceVariables(Translate(`discord.commands.${this.data.name}.execute.success`), { username })
        )
      ]
    });
  }
}

export default PromoteCommand;
