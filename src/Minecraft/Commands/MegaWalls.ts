import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

import HypixelAPIReborn from '../../Private/HypixelAPIReborn.js';
import Translate from '../../Private/Translate.js';
import { FormatError } from '../../Utils/MiscUtils.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';

class EightBallCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('megawalls')
      .setAliases(['mw'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      player = this.getArgs(message)[0] || player;

      const hypixelPlayer = await HypixelAPIReborn.getPlayer(player);
      if (!hypixelPlayer || hypixelPlayer.isRaw()) {
        throw new Error(ReplaceVariables(Translate('minecraft.commands.megawalls.execute.error.player'), { player }));
      }

      const { selectedClass, finalKills, FKDR, wins, WLR, kills, KDR, assists } = hypixelPlayer.stats.MegaWalls;
      this.send(
        ReplaceVariables(Translate('minecraft.commands.megawalls.execute'), {
          selectedClass,
          finalKills,
          FKDR,
          wins,
          WLR,
          kills,
          KDR,
          assists
        })
      );
    } catch (error) {
      if (error instanceof Error) this.send(FormatError(error));
    }
  }
}

export default EightBallCommand;
