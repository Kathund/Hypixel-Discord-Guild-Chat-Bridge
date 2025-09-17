import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import hypixel from '../../Private/HypixelAPIReborn.js';
import { FormatError } from '../../Utils/MiscUtils.js';
import { Guild, Player } from 'hypixel-api-reborn';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class GuildExperienceCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('guildexp')
      .setAliases(['gexp'])
      .setOptions([
        new CommandDataOption().setName('username').setDescription('Minecraft username').setRequired(false)
      ]);
  }

  override async execute(player: string, message: string) {
    player = this.getArgs(message)[0] || player;

    try {
      const hypixelPlayer = await hypixel.getPlayer(player, { guild: true });
      if (!hypixelPlayer || !(hypixelPlayer instanceof Player)) {
        throw new Error(ReplaceVariables(Translate('minecraft.commands.guildexp.execute.error.player'), { player }));
      }
      if (!hypixelPlayer.guild || !(hypixelPlayer.guild instanceof Guild)) {
        throw new Error(
          ReplaceVariables(Translate('minecraft.commands.guildexp.execute.execute.no.guild'), { player })
        );
      }
      const member = hypixelPlayer.guild.members.find((guildMember) => guildMember.uuid === hypixelPlayer.uuid);
      if (!member) {
        throw new Error(
          ReplaceVariables(Translate('minecraft.commands.guildexp.execute.execute.no.guild'), { player })
        );
      }
      this.send(
        ReplaceVariables(Translate('minecraft.commands.guildexp.execute'), {
          player,
          exp: member.weeklyExperience.toLocaleString()
        })
      );
    } catch (error) {
      if (error instanceof Error) this.send(FormatError(error));
    }
  }
}

export default GuildExperienceCommand;
