import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import HypixelAPIReborn from '../../Private/HypixelAPIReborn.js';
import Translate from '../../Private/Translate.js';
import { FormatError } from '../../Utils/MiscUtils.js';
import { FormatNumber, ReplaceVariables } from '../../Utils/StringUtils.js';
import type { BedWarsMode, Player } from 'hypixel-api-reborn';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

type Mode = 'solo' | 'doubles' | 'threes' | 'fours' | '4v4' | 'overall';
type BedWarsInternalName = 'eightOne' | 'eightTwo' | 'fourThree' | 'fourFour' | 'twoFour';

class BedwarsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('bedwars')
      .setAliases(['bw', 'bws'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  convertMode(mode: Mode): BedWarsInternalName {
    switch (mode) {
      case 'solo':
        return 'eightOne';
      case 'doubles':
        return 'eightTwo';
      case 'threes':
        return 'fourThree';
      case 'fours':
        return 'fourFour';
      case '4v4':
        return 'twoFour';
      default:
        return 'eightOne';
    }
  }

  getStats(hypixelPlayer: Player, mode: Mode) {
    let stats: BedWarsMode;
    if (mode === 'overall') {
      stats = hypixelPlayer.stats.BedWars;
    } else {
      const internalMode = this.convertMode(mode);
      stats = hypixelPlayer.stats.BedWars[internalMode];
    }
    const { finals, wins, winstreak } = stats;
    const { broken, ratio } = stats.beds;
    return { finalKills: finals.total.kills, wins, winstreak, broken, BLRatio: ratio };
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

      const { finalKills, wins, winstreak, broken, BLRatio } = this.getStats(hypixelPlayer, mode);
      this.send(
        ReplaceVariables(Translate('minecraft.commands.bedwars.execute'), {
          level: Math.floor(hypixelPlayer.stats.BedWars.level),
          username: hypixelPlayer.nickname,
          mode: Translate(`minecraft.commands.bedwars.execute.${mode}`),
          finalKills: FormatNumber(finalKills),
          wins: FormatNumber(wins),
          bedsBroken: FormatNumber(broken),
          BLRatio,
          winstreak
        })
      );
    } catch (error) {
      if (error instanceof Error) this.send(FormatError(error));
    }
  }
}

export default BedwarsCommand;
