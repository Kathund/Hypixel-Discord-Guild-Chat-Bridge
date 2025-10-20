import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import prettyMilliseconds from 'pretty-ms';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { FloorData, MinecraftManagerWithBot } from '../../Types/Minecraft.js';
import type { SkyBlockMemberDungeonsFloor } from 'hypixel-api-reborn';

class FloorCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('floor')
      .setAliases(['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getSelectedProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const floors: FloorData[] = [];

      const catacombs = profile.me.dungeons.catacombs;
      Object.keys(catacombs)
        .filter((key) => key.startsWith('floor'))
        .filter((key) => !key.endsWith('0'))
        .forEach((floor) => {
          const floorData: SkyBlockMemberDungeonsFloor | null = catacombs[
            floor as keyof typeof catacombs
          ] as SkyBlockMemberDungeonsFloor | null;
          if (floorData === null) return;
          floors.push({
            id: floor.replaceAll('floor', 'f'),
            timesPlayed: floorData.timesPlayed,
            fastestTimeS: floorData.fastestTimeS,
            fastestTimeSPlus: floorData.fastestTimeSPlus
          });
        });

      const masterCatacombs = profile.me.dungeons.masterCatacombs;
      Object.keys(masterCatacombs)
        .filter((key) => key.startsWith('floor'))
        .filter((key) => !key.endsWith('0'))
        .forEach((floor) => {
          const floorData: SkyBlockMemberDungeonsFloor | null = masterCatacombs[
            floor as keyof typeof masterCatacombs
          ] as SkyBlockMemberDungeonsFloor | null;
          if (floorData === null) return;
          floors.push({
            id: floor.replaceAll('floor', 'm'),
            timesPlayed: floorData.timesPlayed,
            fastestTimeS: floorData.fastestTimeS,
            fastestTimeSPlus: floorData.fastestTimeSPlus
          });
        });

      const floorId = message.slice(1, 3);
      const floorData = floors.find((floor) => floor.id === floorId);
      if (floorData === undefined || floorData.timesPlayed === 0) {
        throw new Error(
          ReplaceVariables(Translate('minecraft.commands.floor.execute.error.not.done'), {
            username,
            floor: Translate(`minecraft.commands.floor.execute.${floorId}`)
          })
        );
      }

      this.send(
        ReplaceVariables(Translate('minecraft.commands.floor.execute'), {
          username,
          floor: Translate(`minecraft.commands.floor.execute.${floorId}`),
          timesPlayed: FormatNumber(floorData.timesPlayed),
          fastestTimeSPlus:
            floorData.fastestTimeSPlus > 0
              ? prettyMilliseconds(floorData.fastestTimeSPlus, { secondsDecimalDigits: 0 })
              : Translate('minecraft.commands.floor.execute.run.missing'),
          fastestTimeS:
            floorData.fastestTimeS > 0
              ? prettyMilliseconds(floorData.fastestTimeS, { secondsDecimalDigits: 0 })
              : Translate('minecraft.commands.floor.execute.run.missing')
        })
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default FloorCommand;
