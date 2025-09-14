import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import HypixelAPIReborn from '../../Private/HypixelAPIReborn.js';
import Player from 'hypixel-api-reborn/dist/Structures/Player/Player.js';
import { FormatError } from '../../Utils/MiscUtils.js';
import { FormatNumber, TitleCase } from '../../Utils/StringUtils.js';
import type BedWars from 'hypixel-api-reborn/dist/Structures/MiniGames/BedWars/BedWars.js';
import type BedWarsMode from 'hypixel-api-reborn/dist/Structures/MiniGames/BedWars/BedWarsMode.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

type Mode = 'solo' | 'doubles' | 'threes' | 'fours' | '4v4' | 'overall';

class BedwarsCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('bedwars')
      .setAliases(['bw', 'bws'])
      .setOptions([
        new CommandDataOption().setName('username').setDescription('Minecraft username').setRequired(false)
      ]);
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
      if (hypixelPlayer === undefined || !(hypixelPlayer instanceof Player)) {
        return this.send(`Couldn't find player ${player}.`);
      }

      const { finalKills, wins, winStreak, broken, BLRatio } = this.getStats(hypixelPlayer, mode);
      this.send(
        `[${Math.floor(hypixelPlayer.stats.BedWars.level)}✫] ${hypixelPlayer.nickname} ${TitleCase(
          mode
        )} FK: ${FormatNumber(finalKills)} W: ${FormatNumber(wins)} BB: ${FormatNumber(
          broken
        )} BLR: ${BLRatio} WS: ${winStreak}`
      );
    } catch (error) {
      if (error instanceof Error) this.send(FormatError(error));
    }
  }
}

export default BedwarsCommand;
