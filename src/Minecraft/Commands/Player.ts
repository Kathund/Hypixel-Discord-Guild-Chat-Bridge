import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import HypixelAPIReborn from '../../Private/HypixelAPIReborn.js';
import Translate from '../../Private/Translate.js';
import { FormatError } from '../../Utils/MiscUtils.js';
import { FormatNumber, ReplaceVariables } from '../../Utils/StringUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class PlayerCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('player')
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      player = this.getArgs(message)[0] || player;
      const hypixelPlayer = await HypixelAPIReborn.getPlayer(player, { guild: true });
      if (!hypixelPlayer || hypixelPlayer.isRaw()) {
        throw new Error(ReplaceVariables(Translate('minecraft.commands.player.execute.error.player'), { player }));
      }
      const { achievements, nickname, rank, karma, level, guild } = hypixelPlayer;
      const guildName = guild ? guild.name : Translate('minecraft.commands.player.execute.no.guild');
      this.send(
        ReplaceVariables(Translate('minecraft.commands.player.execute'), {
          rank: rank !== null ? `[${rank}]` : '',
          nickname,
          level,
          karma: FormatNumber(karma, 0),
          achievementPoints: FormatNumber(achievements.points, 0),
          guild: guildName
        })
      );
    } catch (error) {
      if (error instanceof Error) this.send(FormatError(error));
    }
  }
}

export default PlayerCommand;
