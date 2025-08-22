import ReplaceVariables from '../../Private/ReplaceVariables';
import { Message } from 'discord.js';
import type DiscordManager from '../DiscordManager';

class MessageHandler {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onMessage(message: Message): Promise<void> {
    if (message.guild === undefined || message.guild === null || message.author.bot) return;

    const debugChannel = this.discord.Application.config.debug.getValue('debug_channel');
    if (
      this.discord.Application.minecraft.bot !== undefined &&
      debugChannel !== undefined &&
      debugChannel.isStringSelectionOption() &&
      debugChannel.getValue() === message.channel.id
    ) {
      this.discord.Application.minecraft.bot.chat(message.content);
    }

    const messageFormat = this.discord.Application.config.minecraft.getValue('message_format');
    const guildChannel = this.discord.Application.config.discord.getValue('guild_channel');
    const officerChannel = this.discord.Application.config.discord.getValue('officer_channel');
    if (
      this.discord.Application.minecraft.bot !== undefined &&
      messageFormat !== undefined &&
      messageFormat.isStringOption() &&
      guildChannel !== undefined &&
      guildChannel.isStringSelectionOption() &&
      officerChannel !== undefined &&
      officerChannel.isStringSelectionOption() &&
      [guildChannel.getValue(), officerChannel.getValue()].includes(message.channel.id)
    ) {
      const channel = officerChannel.getValue() === message.channel.id ? '/oc' : '/gc';
      const disocrdUser = await message.guild.members.fetch(message.author.id);
      const username = disocrdUser.nickname ?? message.author.globalName ?? `@${message.author.username}`;
      this.discord.Application.minecraft.bot.chat(
        `${channel} ${ReplaceVariables(messageFormat.getValue(), { username, message: message.content })}`
      );
    }
  }
}

export default MessageHandler;
