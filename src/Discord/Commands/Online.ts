import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import Embed from '../Private/Embed.js';
import HypixelDiscordGuildBridgeError from '../../Private/Error.js';
import Translate from '../../Private/Translate.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type { Bot } from 'mineflayer';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { ChatMessage } from 'prismarine-chat';
import type { DiscordManagerWithBot, OnlineMembers, OnlineMembersGroup } from '../../Types/Discord.js';

class OnlineCommand extends Command<DiscordManagerWithBot> {
  constructor(discord: DiscordManagerWithBot) {
    super(discord);
    this.data = new CommandData().setName('online').addGroup('minecraft');
  }

  static getMessages(bot: Bot): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const cachedMessages: string[] = [];
      const listener = (event: ChatMessage) => {
        const message = event.toString();
        cachedMessages.push(message);
        if (message.startsWith('Offline Members')) {
          bot.removeListener('message', listener);
          resolve(cachedMessages);
        }
      };

      bot.on('message', listener);
      bot.chat('/g online');

      setTimeout(() => {
        bot.removeListener('message', listener);
        reject(new Error('Command timed out. Please try again.'));
      }, 5000);
    });
  }

  static async getOnlineMembers(bot: Bot): Promise<OnlineMembers> {
    const messages = await this.getMessages(bot);
    let onlineString = messages.find((message) => message.startsWith('Online Members: '));
    if (onlineString === undefined) {
      throw new HypixelDiscordGuildBridgeError(Translate('discord.commands.online.execute.error.missing.online'));
    }
    const online = Number(onlineString.split('Online Members: ')?.[1] || '0');
    onlineString = ReplaceVariables(Translate('discord.commands.online.execute.online'), { members: online });

    let totalString = messages.find((message) => message.startsWith('Total Members: '));
    if (totalString === undefined) {
      throw new HypixelDiscordGuildBridgeError(Translate('discord.commands.online.execute.error.missing.total'));
    }
    const total = Number(totalString.split('Total Members: ')?.[1] || '0');
    totalString = ReplaceVariables(Translate('discord.commands.online.execute.total'), { members: total });

    const groups: OnlineMembersGroup[] = [];
    messages.flatMap((item, index) => {
      if (!item.includes('-- ')) return;
      const nextLine = messages[index + 1];
      if (!nextLine) return;
      if (!nextLine.includes('●')) return;
      const rank = item.replaceAll('--', '').trim();
      const players = nextLine
        .split('●')
        .map((item) => item.trim())
        .filter((item) => item);
      if (rank === undefined || players === undefined) return;
      groups.push({ name: rank, value: players.map((player) => `\`${player}\``).join(', ') });
    });

    return { online, onlineString, total, totalString, groups };
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const members = await OnlineCommand.getOnlineMembers(this.discord.Application.minecraft.bot);
    const embed = new Embed()
      .setTitle(Translate('discord.commands.online.execute.title'))
      .setDescription(
        ReplaceVariables(Translate('discord.commands.online.execute.description'), {
          total: members.totalString,
          online: members.onlineString
        })
      )
      .setFields(members.groups)
      .setDev('duckysolucky');

    await interaction.followUp({ embeds: [embed] });
  }
}

export default OnlineCommand;
