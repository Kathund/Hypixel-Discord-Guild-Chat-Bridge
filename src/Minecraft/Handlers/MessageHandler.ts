import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import { CleanMessageForDiscord } from '../../Utils/StringUtils';
import { StringConfigJSON, SubConfigConfigJSON } from '../../types/Configs';
import type MinecraftManager from '../MinecraftManager';
import type { ChatMessage } from 'prismarine-chat';

class MessageHandler {
  declare readonly minecraft: MinecraftManager;
  constructor(minecraftManager: MinecraftManager) {
    this.minecraft = minecraftManager;
  }

  registerEvents() {
    if (!this.minecraft.bot) return;
    this.minecraft.bot.on('message', (...args) => this.onMessage(...args));
  }

  async onMessage(event: ChatMessage, position: string) {
    if (!this.minecraft.isBotOnline()) return;
    const message = event.toString();
    const rawMessage = event.toMotd();

    const debugChannel = this.minecraft.Application.config.debug.getValue('debug_channel');
    if (
      this.minecraft.Application.discord.client &&
      debugChannel?.isStringSelectionOption() &&
      debugChannel?.getValue()
    ) {
      const channel = await this.minecraft.Application.discord.client.channels.fetch(debugChannel.getValue());
      if (channel?.isSendable()) {
        channel.send({ content: CleanMessageForDiscord(rawMessage), allowedMentions: { parse: [] } });
      }
    }

    if (
      this.isLobbyJoinMessage(message) &&
      this.minecraft.Application.config.minecraft.getValue('auto_limbo')?.isBooleanOption() &&
      this.minecraft.Application.config.minecraft.getValue('auto_limbo')?.getValue()
    ) {
      this.minecraft.bot.chat('/limbo');
    }

    const eventConfig = this.minecraft.Application.config.minecraft.getValue('events');
    if (eventConfig?.isSubConfigConfig()) {
      const config = eventConfig.getValue();

      if (this.isLoginMessage(message) && (config?.member_login as SubConfigConfigJSON)?.value?.enabled?.value) {
        const username = message.split('>')[1].trim().split('joined.')[0].trim();
        return this.getEventsChannels('member_login').forEach((channel) =>
          this.minecraft.sendToDiscordMessage(
            ReplaceVariables(Translate('minecraft.chat.events.login'), { username }),
            channel
          )
        );
      }

      if (this.isLogoutMessage(message) && (config?.member_logout as SubConfigConfigJSON)?.value?.enabled?.value) {
        const username = message.split('>')[1].trim().split('left.')[0].trim();
        return this.getEventsChannels('member_logout').forEach((channel) =>
          this.minecraft.sendToDiscordMessage(
            ReplaceVariables(Translate('minecraft.chat.events.left'), { username }),
            channel
          )
        );
      }

      if (this.isJoinMessage(message) && (config?.guild_member_join as SubConfigConfigJSON)?.value?.enabled?.value) {
        const username = this.getUsernameFromEventMessage(message);
        if (
          ((config?.guild_member_join as SubConfigConfigJSON)?.value?.join_message as StringConfigJSON)?.value
            ?.length !== 0
        ) {
          this.minecraft.bot.chat(
            `/gc ${ReplaceVariables(
              ((config?.guild_member_join as SubConfigConfigJSON)?.value?.join_message as StringConfigJSON)?.value,
              { username }
            )}`
          );
        }
        return this.getEventsChannels('guild_member_join').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.join'), { username }),
              title: Translate('minecraft.chat.events.guild.member.join.title'),
              username,
              color: 'Green'
            },
            channel
          )
        );
      }

      if (this.isLeaveMessage(message) && (config?.guild_member_leave as SubConfigConfigJSON)?.value?.enabled?.value) {
        const username = this.getUsernameFromEventMessage(message);
        return this.getEventsChannels('guild_member_leave').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.leave'), { username }),
              title: Translate('minecraft.chat.events.guild.member.leave.title'),
              username,
              color: 'Red'
            },
            channel
          )
        );
      }

      if (this.isKickMessage(message) && (config?.guild_member_kick as SubConfigConfigJSON)?.value?.enabled?.value) {
        const username = this.getUsernameFromEventMessage(message);
        return this.getEventsChannels('guild_member_kick').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.kick'), { username }),
              title: Translate('minecraft.chat.events.guild.member.kick.title'),
              username,
              color: 'Red'
            },
            channel
          )
        );
      }

      if (
        this.isPromotionMessage(message) &&
        (config?.guild_member_promote as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        const username = this.getUsernameFromEventMessage(message);
        const rank =
          message
            .replace(/\[(.*?)\]/g, '')
            .trim()
            .split(' to ')
            .pop()
            ?.trim() ?? '';
        return this.getEventsChannels('guild_member_promote').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.promote'), { username, rank }),
              title: Translate('minecraft.chat.events.guild.member.promote.title'),
              username,
              color: 'Green'
            },
            channel
          )
        );
      }

      if (
        this.isDemotionMessage(message) &&
        (config?.guild_member_demote as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        const username = this.getUsernameFromEventMessage(message);
        const rank =
          message
            .replace(/\[(.*?)\]/g, '')
            .trim()
            .split(' to ')
            .pop()
            ?.trim() ?? '';
        return this.getEventsChannels('guild_member_demote').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.demote'), { username, rank }),
              title: Translate('minecraft.chat.events.guild.member.demote.title'),
              username,
              color: 'Red'
            },
            channel
          )
        );
      }

      if (
        this.isCannotMuteMoreThanOneMonth(message) &&
        (config?.guild_member_mute_month as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        return this.getEventsChannels('guild_member_mute_month').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: Translate('minecraft.chat.events.guild.member.demote'),
              color: 'Green'
            },
            channel
          )
        );
      }

      if (this.isRepeatMessage(message) && (config?.repeat as SubConfigConfigJSON)?.value?.enabled?.value) {
        return this.getEventsChannels('repeat').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: Translate('minecraft.chat.events.repeat'),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (this.isNoPermission(message) && (config?.missing_perms as SubConfigConfigJSON)?.value?.enabled?.value) {
        return this.getEventsChannels('missing_perms').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: Translate('minecraft.chat.events.missing.perms'),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (this.isMuted(message) && (config?.bot_muted as SubConfigConfigJSON)?.value?.enabled?.value) {
        const formattedMessage = message.split(' ').slice(1).join(' ');
        return this.getEventsChannels('bot_muted').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: formattedMessage,
              title: Translate('minecraft.chat.events.bot.muted'),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (this.isIncorrectUsage(message) && (config?.bad_use as SubConfigConfigJSON)?.value?.enabled?.value) {
        return this.getEventsChannels('bad_use').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: message.split("'").join('`'),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (this.isOnlineInvite(message) && (config?.guild_member_invite as SubConfigConfigJSON)?.value?.enabled?.value) {
        const username = message
          .replace(/\[(.*?)\]/g, '')
          .trim()
          .split(/ +/g)[2];
        return this.getEventsChannels('guild_member_invite').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.invited'), { username }),
              color: 'Green'
            },
            channel
          )
        );
      }

      if (
        this.isOfflineInvite(message) &&
        (config?.guild_member_invite_offline as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        const username = message
          .replace(/\[(.*?)\]/g, '')
          .trim()
          .split(/ +/g)[6]!
          .match(/\w+/g)![0];
        return this.getEventsChannels('guild_member_invite_offline').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.invited.offline'), { username }),
              color: 'Green'
            },
            channel
          )
        );
      }

      if (
        this.isFailedInvite(message) &&
        (config?.guild_member_invite_fail as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        return this.getEventsChannels('guild_member_invite_fail').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: message.replace(/\[(.*?)\]/g, '').trim(),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (this.isGuildMuteMessage(message) && (config?.guild_mute as SubConfigConfigJSON)?.value?.enabled?.value) {
        const time = message
          .replace(/\[(.*?)\]/g, '')
          .trim()
          .split(/ +/g)[7];
        return this.getEventsChannels('guild_mute').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.mute'), { time }),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (this.isGuildUnmuteMessage(message) && (config?.guild_unmute as SubConfigConfigJSON)?.value?.enabled?.value) {
        return this.getEventsChannels('guild_unmute').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: Translate('minecraft.chat.events.guild.unmute'),
              color: 'Green'
            },
            channel
          )
        );
      }

      if (
        this.isUserMuteMessage(message) &&
        (config?.guild_member_mute as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        const username = message
          .replace(/\[(.*?)\]/g, '')
          .trim()
          .split(/ +/g)[3]
          .replace(/[^\w]+/g, '');
        const time = message
          .replace(/\[(.*?)\]/g, '')
          .trim()
          .split(/ +/g)[5];
        return this.getEventsChannels('guild_member_mute').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.mute'), { username, time }),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (
        this.isUserUnmuteMessage(message) &&
        (config?.guild_member_unmute as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        const username = message
          .replace(/\[(.*?)\]/g, '')
          .trim()
          .split(/ +/g)[3];
        return this.getEventsChannels('guild_member_unmute').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.unmute'), { username }),
              color: 'Green'
            },
            channel
          )
        );
      }

      if (
        this.isSetRankFail(message) &&
        (config?.guild_member_set_rank_fail as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        const rank = message
          .replace(/\[(.*?)\]/g, '')
          .trim()
          .split(/ +/g)
          .at(-1)
          ?.replace(/[-'!]/g, '');
        return this.getEventsChannels('guild_member_set_rank_fail').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.set.rank.fail'), { rank }),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (
        this.isAlreadyMuted(message) &&
        (config?.guild_member_mute_already as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        return this.getEventsChannels('guild_member_mute_already').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: Translate('minecraft.chat.events.guild.member.mute.already'),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (
        this.isNotInGuild(message) &&
        (config?.guild_member_not_in_guild as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        const username = message
          .replace(/\[(.*?)\]/g, '')
          .trim()
          .split(' ')[0];
        return this.getEventsChannels('guild_member_not_in_guild').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.not.in.guild'), { username }),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (
        this.isLowestRank(message) &&
        (config?.guild_member_lowest_rank as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        const username = message
          .replace(/\[(.*?)\]/g, '')
          .trim()
          .split(' ')[0];
        return this.getEventsChannels('guild_member_lowest_rank').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: ReplaceVariables(Translate('minecraft.chat.events.guild.member.lowest.rank'), { username }),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (
        this.isAlreadyHasRank(message) &&
        (config?.guild_member_already_has_rank as SubConfigConfigJSON)?.value?.enabled?.value
      ) {
        return this.getEventsChannels('guild_member_already_has_rank').forEach((channel) =>
          this.minecraft.sendToDiscordEmbed(
            {
              message: Translate('minecraft.chat.events.guild.member.already.has.rank'),
              color: 'Red'
            },
            channel
          )
        );
      }

      if (this.isTooFast(message)) {
        // eslint-disable-next-line hypixelDiscordGuildChatBridge/enforce-translate
        return console.warn(message);
      }
    }

    const regex =
      // eslint-disable-next-line max-len
      /^(?<chatType>\w+) > (?:(?:\[(?<rank>[^\]]+)\] )?(?:(?<username>\w+)(?: \[(?<guildRank>[^\]]+)\])?: )?)?(?<message>.+)$/;
    const match = message.match(regex);
    if (!match || !match?.groups) return;

    if (this.isDiscordMessage(match.groups.message) === false) {
      const { chatType, rank = '', username, guildRank = '', message } = match.groups;
      if (message.includes('replying to') && username === this.minecraft.bot.username) return;
      const channelConfig = this.minecraft.Application.config.discord.getValue(`${chatType.toLowerCase()}_channel`);
      const messageFormat = this.minecraft.Application.config.discord.getValue('message_format');
      if (
        channelConfig?.isStringSelectionOption() &&
        messageFormat?.isStringOption() &&
        channelConfig.getValue() &&
        messageFormat.getValue()
      ) {
        this.minecraft.sendToDiscordMessage(
          ReplaceVariables(messageFormat.getValue(), {
            chatType,
            rank: rank ? `[${rank}]` : '',
            username,
            guildRank: guildRank ? `[${guildRank}]` : '',
            message
          }),
          channelConfig.getValue()
        );
      }
    }
  }

  getEventsChannels(event: string): string[] {
    const channels: string[] = [];
    const eventConfig = this.minecraft.Application.config.minecraft.getValue('events');
    if (!eventConfig || !eventConfig.isSubConfigConfig()) return channels;
    const eventConfigOption = eventConfig.getValue()?.[event] as SubConfigConfigJSON | undefined;
    if (!eventConfigOption?.value?.enabled?.value) return channels;

    const guildChannel = this.minecraft.Application.config.discord.getValue('guild_channel');
    if (guildChannel?.getValue() !== undefined && eventConfigOption?.value?.guild_channel.value !== false) {
      channels.push(guildChannel.getValue() as string);
    }

    const officerChannel = this.minecraft.Application.config.discord.getValue('officer_channel');
    if (officerChannel?.getValue() !== undefined && eventConfigOption?.value?.officer_channel.value !== false) {
      channels.push(officerChannel.getValue() as string);
    }

    const logChannel = this.minecraft.Application.config.discord.getValue('logging_channel');
    if (logChannel?.getValue() !== undefined && eventConfigOption?.value?.log_channel.value !== false) {
      channels.push(logChannel.getValue() as string);
    }

    return channels;
  }

  getUsernameFromEventMessage(message: string): string {
    const regex = /(?:\[(?<rank>[^\]]+)\] )?(?<username>[^\s]+) (?<event>.+)/;
    const match = message.match(regex);
    if (match === null || !match.groups) return '';
    return match.groups.username;
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

  isLoginMessage(message: string) {
    return message.startsWith('Guild >') && message.endsWith('joined.') && !message.includes(':');
  }

  isLogoutMessage(message: string) {
    return message.startsWith('Guild >') && message.endsWith('left.') && !message.includes(':');
  }

  isJoinMessage(message: string): boolean {
    return message.includes('joined the guild!') && !message.includes(':');
  }

  isLeaveMessage(message: string): boolean {
    return message.includes('left the guild!') && !message.includes(':');
  }

  isKickMessage(message: string): boolean {
    return message.includes('was kicked from the guild by') && !message.includes(':');
  }

  isPromotionMessage(message: string): boolean {
    return message.includes('was promoted from') && !message.includes(':');
  }

  isDemotionMessage(message: string): boolean {
    return message.includes('was demoted from') && !message.includes(':');
  }

  isRequestMessage(message: string): boolean {
    return message.includes('has requested to join the Guild!');
  }

  isRepeatMessage(message: string): boolean {
    return message === 'You cannot say the same message twice!';
  }

  isNoPermission(message: string): boolean {
    return (
      (message.includes('You must be the Guild Master to use that command!') ||
        message.includes('You do not have permission to use this command!') ||
        message.includes(
          // eslint-disable-next-line max-len
          "I'm sorry, but you do not have permission to perform this command. Please contact the server administrators if you believe that this is in error."
        ) ||
        message.includes('You cannot mute a guild member with a higher guild rank!') ||
        message.includes('You cannot kick this player!') ||
        message.includes('You can only promote up to your own rank!') ||
        message.includes('You cannot mute yourself from the guild!') ||
        message.includes("is the guild master so can't be demoted!") ||
        message.includes("is the guild master so can't be promoted anymore!") ||
        message.includes('You do not have permission to kick people from the guild!')) &&
      !message.includes(':')
    );
  }

  isMuted(message: string): boolean {
    return message.includes('Your mute will expire in') && !message.includes(':');
  }

  isIncorrectUsage(message: string): boolean {
    return message.includes('Invalid usage!') && !message.includes(':');
  }

  isOnlineInvite(message: string): boolean {
    return (
      message.includes('You invited') &&
      message.includes('to your guild. They have 5 minutes to accept.') &&
      !message.includes(':')
    );
  }

  isOfflineInvite(message: string): boolean {
    return (
      message.includes('You sent an offline invite to') &&
      message.includes('They will have 5 minutes to accept once they come online!') &&
      !message.includes(':')
    );
  }

  isFailedInvite(message: string): boolean {
    return (
      (message.includes('is already in another guild!') ||
        message.includes('You cannot invite this player to your guild!') ||
        (message.includes("You've already invited") && message.includes('to your guild! Wait for them to accept!')) ||
        message.includes('is already in your guild!')) &&
      !message.includes(':')
    );
  }

  isUserMuteMessage(message: string): boolean {
    return message.includes('has muted') && message.includes('for') && !message.includes(':');
  }

  isUserUnmuteMessage(message: string): boolean {
    return message.includes('has unmuted') && !message.includes(':');
  }

  isCannotMuteMoreThanOneMonth(message: string): boolean {
    return message.includes('You cannot mute someone for more than one month') && !message.includes(':');
  }

  isGuildMuteMessage(message: string): boolean {
    return message.includes('has muted the guild chat for') && !message.includes(':');
  }

  isGuildUnmuteMessage(message: string): boolean {
    return message.includes('has unmuted the guild chat!') && !message.includes(':');
  }

  isSetRankFail(message: string): boolean {
    return message.includes("I couldn't find a rank by the name of ") && !message.includes(':');
  }

  isAlreadyMuted(message: string): boolean {
    return message.includes('This player is already muted!') && !message.includes(':');
  }

  isNotInGuild(message: string): boolean {
    return message.includes(' is not in your guild!') && !message.includes(':');
  }

  isLowestRank(message: string): boolean {
    return message.includes("is already the lowest rank you've created!") && !message.includes(':');
  }

  isAlreadyHasRank(message: string): boolean {
    return message.includes('They already have that rank!') && !message.includes(':');
  }

  isTooFast(message: string): boolean {
    return message.includes('You are sending commands too fast! Please slow down.') && !message.includes(':');
  }
}

export default MessageHandler;
