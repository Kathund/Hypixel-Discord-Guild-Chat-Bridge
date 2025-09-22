import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import HypixelAPIReborn from '../../Private/HypixelAPIReborn.js';
import Translate from '../../Private/Translate.js';
import { type BedWars, type BedWarsMode, Player } from 'hypixel-api-reborn';
import { FormatError } from '../../Utils/MiscUtils.js';
import { FormatNumber, ReplaceVariables } from '../../Utils/StringUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

type Mode = 'solo' | 'doubles' | 'threes' | 'fours' | '4v4' | 'overall';

class BedwarsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('bedwars')
      .setAliases(['bw', 'bws'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  getStats(hypixelPlayer: Player, mode: Mode) {
    const stats: BedWars | BedWarsMode =
      mode === 'overall' ? hypixelPlayer.stats.BedWars : hypixelPlayer.stats.BedWars[mode];
    const { finalKills, wins, winStreak } = stats;
    const { broken, BLRatio } = stats.beds;
    return { finalKills, wins, winStreak, broken, BLRatio };
  }

  override async execute(player: string, message: string) {
    try {
      const msg = this.getArgs(message).map((arg) => arg.replaceAll('/', ''));
      const modes = ['solo', 'doubles', 'threes', 'fours', '4v4'];

      const mode: Mode = (msg[0] ? (modes.includes(msg[0]) ? msg[0] : 'overall') : 'overall') as Mode;
      player = msg[0] ? (modes.includes(msg[0]) ? (msg[1] ? msg[1] : player) : msg[0] || player) : player;

      const hypixelPlayer = await HypixelAPIReborn.getPlayer(player);
      if (!hypixelPlayer || hypixelPlayer.isRaw()) {
        throw new Error(ReplaceVariables(Translate('minecraft.commands.bedwars.execute.error.player'), { player }));
      }

      const { finalKills, wins, winStreak, broken, BLRatio } = this.getStats(hypixelPlayer, mode);
      this.send(
        ReplaceVariables(Translate('minecraft.commands.bedwars.execute'), {
          level: Math.floor(hypixelPlayer.stats.BedWars.level),
          username: hypixelPlayer.nickname,
          mode: Translate(`minecraft.commands.bedwars.execute.${mode}`),
          finalKills: FormatNumber(finalKills),
          wins: FormatNumber(wins),
          bedsBroken: FormatNumber(broken),
          BLRatio,
          winStreak
        })
      );
    } catch (error) {
      if (error instanceof Error) this.send(FormatError(error));
    }
  }
}

export default BedwarsCommand;
