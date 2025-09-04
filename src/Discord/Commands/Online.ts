import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import Embed from '../Private/Embed';
import HypixelDiscordGuildBridgeError from '../../Private/Error';
import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import type DiscordManager from '../DiscordManager';
import type { Bot } from 'mineflayer';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { ChatMessage } from 'prismarine-chat';

class OnlineCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('online');
  }
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.discord.Application.minecraft.isBotOnline()) {
      throw new HypixelDiscordGuildBridgeError(Translate('minecraft.error.botOffline'));
    }
    const messages = await this.getMessages(this.discord.Application.minecraft.bot);
    let online = messages.find((message) => message.startsWith('Online Members: '));
    if (online === undefined) {
      throw new HypixelDiscordGuildBridgeError(Translate('discord.commands.online.execute.error.missing.online'));
    }
    online = ReplaceVariables(Translate('discord.commands.online.execute.online'), {
      members: online.split('Online Members: ')[1]
    });

    let total = messages.find((message) => message.startsWith('Total Members: '));
    if (total === undefined) {
      throw new HypixelDiscordGuildBridgeError(Translate('discord.commands.online.execute.error.missing.total'));
    }
    total = ReplaceVariables(Translate('discord.commands.online.execute.total'), {
      members: total.split('Total Members: ')[1]
    });

    const embed = new Embed()
      .setTitle(Translate('discord.commands.online.execute.title'))
      .setDescription(ReplaceVariables(Translate('discord.commands.online.execute.description'), { total, online }))
      .setDev('duckysolucky');

    messages
      .flatMap((item, index) => {
        if (!item.includes('-- ')) return;
        const nextLine = messages[index + 1];
        if (!nextLine.includes('●')) return;
        const rank = item.replaceAll('--', '').trim();
        const players = nextLine
          .split('●')
          .map((item) => item.trim())
          .filter((item) => item);
        if (rank === undefined || players === undefined) return;
        embed.addFields({ name: rank, value: players.map((player) => `\`${player}\``).join(', ') });
      })
      .filter((item) => item);
    await interaction.followUp({ embeds: [embed] });
  }

  getMessages(bot: Bot): Promise<string[]> {
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
}

export default OnlineCommand;
