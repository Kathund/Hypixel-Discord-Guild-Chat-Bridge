import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import HypixelDiscordGuildBridgeError from '../../Private/Error.js';
import ReplaceVariables from '../../Private/ReplaceVariables.js';
import Translate, { unTranslate } from '../../Private/Translate.js';
import { ChatInputCommandInteraction, SlashCommandStringOption } from 'discord.js';
import { SuccessEmbed } from '../Private/Embed.js';
import type { DiscordManagerWithBot } from '../../Types/Discord.js';

class MuteCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData()
      .setName('mute')
      .addStringOption(new SlashCommandStringOption().setName('username').setRequired(true))
      .addStringOption(new SlashCommandStringOption().setName('time').setRequired(true))
      .addGroup('minecraft');
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.discord.Application.minecraft.isBotOnline()) {
      throw new HypixelDiscordGuildBridgeError(Translate('minecraft.error.botOffline'));
    }
    const username = interaction.options.getString(Translate(`discord.commands.${this.data.name}.options.username`));
    if (!username) {
      throw new HypixelDiscordGuildBridgeError(
        Translate(`discord.commands.${this.data.name}.options.username.missing`)
      );
    }
    const time = interaction.options.getString(Translate(`discord.commands.${this.data.name}.options.time`));
    if (!time) {
      throw new HypixelDiscordGuildBridgeError(Translate(`discord.commands.${this.data.name}.options.time.missing`));
    }

    this.discord.minecraftCommandData = { name: Translate(unTranslate(this.data.name), 'en_us'), interaction };
    setTimeout(() => {
      this.discord.minecraftCommandData = undefined;
    }, 5000);

    this.discord.Application.minecraft.bot.chat(`/g mute ${username} ${time}`);
    await interaction.followUp({
      embeds: [
        new SuccessEmbed(
          ReplaceVariables(Translate(`discord.commands.${this.data.name}.execute.success`), { username })
        )
      ]
    });
  }
}

export default MuteCommand;
