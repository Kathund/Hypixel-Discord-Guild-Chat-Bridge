import { Message } from 'discord.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type DiscordManager from '../DiscordManager.js';

class MessageHandler {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onMessage(message: Message): Promise<void> {
    if (!message.guild || message.author.bot) return;
    if (!this.discord.Application.minecraft.isBotOnline()) return;

    if (this.discord.Application.config.debug.getValue('debug_channel')?.getValue() === message.channel.id) {
      this.discord.Application.minecraft.bot.chat(message.content);
    }

    if (
      this.discord.Application.config.minecraft.getValue('message_format')?.isStringOption() &&
      this.discord.Application.config.discord.getValue('guild_channel')?.isStringSelectionOption() &&
      this.discord.Application.config.discord.getValue('officer_channel')?.isStringSelectionOption()
    ) {
      const messageFormat = this.discord.Application.config.minecraft.getValue('message_format')!;
      const guildChannel = this.discord.Application.config.discord.getValue('guild_channel')!;
      const officerChannel = this.discord.Application.config.discord.getValue('officer_channel')!;
      if ([guildChannel.getValue(), officerChannel.getValue()].includes(message.channel.id)) {
        const channel = message.channel.id === officerChannel.getValue() ? '/oc' : '/gc';
        const discordUser = await message.guild.members.fetch(message.author.id);
        if (!messageFormat.isStringOption()) return;
        const formatValue = messageFormat.getValue() as string;
        this.discord.Application.minecraft.bot.chat(
          `${channel} ${ReplaceVariables(formatValue, {
            username: discordUser.nickname ?? message.author.globalName ?? `@${message.author.username}`,
            message: message.content
          })}`
        );
      }
    }
  }
}

export default MessageHandler;
