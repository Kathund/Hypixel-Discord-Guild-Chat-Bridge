import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import hypixel from '../../Private/HypixelAPIReborn.js';
import { FormatError } from '../../Utils/MiscUtils.js';
import { FormatNumber, ReplaceVariables, TitleCase } from '../../Utils/StringUtils.js';
import { Guild } from 'hypixel-api-reborn';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class GuildInformationCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('guild')
      .setAliases(['g'])
      .setOptions([new CommandDataOption().setName('guild').setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    try {
      const guildName = this.getArgs(message)
        .map((arg) => TitleCase(arg))
        .join(' ');

      const guild = await hypixel.getGuild('name', guildName);
      if (!guild || !(guild instanceof Guild)) {
        throw new Error(
          ReplaceVariables(Translate('minecraft.commands.guild.execute.error.exist'), { name: guildName })
        );
      }

      const { name, tag, members, level, totalWeeklyGEXP } = guild;
      this.send(
        ReplaceVariables(Translate('minecraft.commands.guild.execute'), {
          name,
          tag,
          members: members.length,
          level,
          gexp: FormatNumber(totalWeeklyGEXP)
        })
      );
    } catch (error) {
      if (error instanceof Error) this.send(FormatError(error));
    }
  }
}

export default GuildInformationCommand;
