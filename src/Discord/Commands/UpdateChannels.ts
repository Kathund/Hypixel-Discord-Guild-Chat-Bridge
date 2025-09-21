import BaseConfigInstance from '../../Config/Private/BaseConfigInstance.js';
import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import HypixelAPIReborn from '../../Private/HypixelAPIReborn.js';
import OnlineCommand from './Online.js';
import Translate, { unTranslate } from '../../Private/Translate.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import { SuccessEmbed } from '../Private/Embed.js';
import type SubConfigOption from '../../Config/Options/SubConfig.js';
import type { Bot } from 'mineflayer';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { DiscordManagerWithClient } from '../../Types/Discord.js';
import type { SubConfigConfigJSON } from '../../Types/Configs.js';

class UpdateChannelsCommand extends Command {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new CommandData().setName('update_channels');
  }

  static async updateChannels(client: Client, bot: Bot, channelConfig: SubConfigOption): Promise<number> {
    let updatedChannels = 0;
    const guild = await client.guilds.fetch(process.env.SERVER_ID);
    const hypixelGuild = await HypixelAPIReborn.getGuild('player', bot.username);
    if (hypixelGuild === null || hypixelGuild.isRaw()) return updatedChannels;
    const [channels, roles] = await Promise.all([guild.channels.fetch(), guild.roles.fetch()]);
    const { online } = await OnlineCommand.getOnlineMembers(bot);

    /* eslint-disable camelcase */
    const stats = {
      guild_online: online,
      guild_name: hypixelGuild.name,
      guild_level: hypixelGuild.level.toFixed(0),
      guild_level_with_progress: hypixelGuild.level,
      guild_xp: hypixelGuild.experience,
      guild_weekly_xp: hypixelGuild.totalWeeklyGEXP,
      guild_members: hypixelGuild.members.length,
      discord_members: guild.memberCount,
      discord_channels: channels.size,
      discord_roles: roles.size
    };
    /* eslint-enable camelcase */

    const statChannels: { id: string; format: string }[] = [];
    for (let i = 0; i < 5; i++) {
      const channelConfigOption = channelConfig.getValue()?.[`slot${i + 1}`] as SubConfigConfigJSON | undefined;
      if (!channelConfigOption?.value?.enabled?.value) continue;
      statChannels.push({
        id: (channelConfigOption?.value?.channel?.value as string) || 'UNKNOWN',
        format: (channelConfigOption?.value?.format?.value as string) || 'UNKNOWN'
      });
    }

    const fixedChannels = statChannels
      .filter((channel) => channel.id !== 'UNKNOWN')
      .filter((channel) => channel.format !== 'UNKNOWN');
    for (const channelData of fixedChannels) {
      try {
        const channel = await guild.channels.fetch(channelData.id);
        if (channel) await channel.setName(ReplaceVariables(channelData.format, stats), 'Updating Channel');
        updatedChannels++;
      } catch (error) {
        console.error(error);
      }
    }

    return updatedChannels;
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.discord.Application.minecraft.isBotOnline()) {
      throw new Error(Translate('minecraft.error.bot.offline'));
    }
    const commandConfig = this.discord.Application.config.discord.getValue('commands');
    if (!commandConfig || !commandConfig.isSubConfigConfig()) {
      throw new Error(Translate('discord.commands.update_channels.execute.error.missing.config'));
    }
    const untranslatedName = unTranslate(this.data.name);
    if (untranslatedName.includes('|')) return;
    const commandConfigOption = commandConfig.getValue()?.[Translate(untranslatedName, 'en_us')] as
      | SubConfigConfigJSON
      | undefined;
    if (commandConfigOption?.value === undefined) {
      throw new Error(Translate('discord.commands.update_channels.execute.error.missing.config'));
    }
    const configOption = BaseConfigInstance.getConfigOption(commandConfigOption);
    if (configOption === undefined || !configOption.isSubConfigConfig()) {
      throw new Error(Translate('discord.commands.update_channels.execute.error.missing.config'));
    }
    const amount = await UpdateChannelsCommand.updateChannels(
      interaction.client,
      this.discord.Application.minecraft.bot,
      configOption
    );
    await interaction.followUp({
      embeds: [
        new SuccessEmbed(ReplaceVariables(Translate('discord.commands.update_channels.execute.success'), { amount }))
      ]
    });
  }
}

export default UpdateChannelsCommand;
