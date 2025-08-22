import ReplaceVariables from '../../Private/ReplaceVariables';
import type MinecraftManager from '../MinecraftManager';
import type { ChatMessage } from 'prismarine-chat';

class MessageHandler {
  declare readonly minecraft: MinecraftManager;
  constructor(minecraftManager: MinecraftManager) {
    this.minecraft = minecraftManager;
  }

  registerEvents() {
    if (this.minecraft.bot === undefined) return;
    this.minecraft.bot.on('message', (...args) => this.onMessage(...args));
  }

  async onMessage(event: ChatMessage, position: string) {
    if (this.minecraft.bot === undefined) return;
    const message = event.toString();
    const rawMessage = event.toMotd();

    const debugChannel = this.minecraft.Application.config.debug.getValue('debug_channel');
    if (
      debugChannel?.isStringSelectionOption() &&
      debugChannel.getValue() !== '' &&
      this.minecraft.Application.discord.client
    ) {
      const channel = await this.minecraft.Application.discord.client.channels.fetch(debugChannel.getValue());
      if (channel !== undefined && channel !== null && channel.isSendable()) {
        channel.send({
          content: this.minecraft.Application.discord.utils.cleanMessage(rawMessage),
          allowedMentions: { parse: [] }
        });
      }
    }

    const autoLimbo = this.minecraft.Application.config.minecraft.getValue('auto_limbo');
    if (this.isLobbyJoinMessage(message) && autoLimbo?.isBooleanOption() && autoLimbo.getValue()) {
      return this.minecraft.bot.chat('/limbo');
    }

    const regex =
      // eslint-disable-next-line max-len
      /^(?<chatType>\w+) > (?:(?:\[(?<rank>[^\]]+)\] )?(?:(?<username>\w+)(?: \[(?<guildRank>[^\]]+)\])?: )?)?(?<message>.+)$/;

    const match = message.match(regex);

    if (!match?.groups) return;

    if (this.isDiscordMessage(match.groups.message) === false) {
      let { chatType, rank = '', username, guildRank = '', message } = match.groups;
      if (rank !== '') rank = `[${rank}]`;
      if (guildRank !== '') guildRank = `[${guildRank}]`;
      if (message.includes('replying to') && username === this.minecraft.bot.username) return;

      const channelConfig = this.minecraft.Application.config.discord.getValue(`${chatType.toLowerCase()}_channel`);
      const messageFormat = this.minecraft.Application.config.discord.getValue('message_format');
      if (
        channelConfig?.isStringSelectionOption() &&
        channelConfig.getValue() !== '' &&
        messageFormat?.isStringOption() &&
        messageFormat.getValue() !== '' &&
        this.minecraft.Application.discord.client
      ) {
        const channel = await this.minecraft.Application.discord.client.channels.fetch(channelConfig.getValue());
        if (channel !== undefined && channel !== null && channel.isSendable()) {
          channel.send({
            content: this.minecraft.Application.discord.utils.cleanMessage(
              ReplaceVariables(messageFormat.getValue(), {
                chatType,
                rank: rank ? `[${rank}]` : '',
                username,
                guildRank: guildRank ? `[${guildRank}]` : '',
                message
              })
                .replace(/\s{2,}/g, ' ')
                .trim()
            ),
            allowedMentions: { parse: [] }
          });
        }
      }
    }
  }

  isLobbyJoinMessage(message: string): boolean {
    return (message.endsWith(' the lobby!') || message.endsWith(' the lobby! <<<')) && message.includes('[MVP+');
  }

  isDiscordMessage(message: string): boolean {
    const isDiscordMessage = /^(?<username>(?!https?:\/\/)[^\s»:>]+)\s*[»:>]\s*(?<message>.*)/;

    const match = message.match(isDiscordMessage);
    if (!match?.groups) return false;
    if (match && ['Party', 'Guild', 'Officer'].includes(match.groups.username)) {
      return false;
    }

    return isDiscordMessage.test(message);
  }
}

export default MessageHandler;
