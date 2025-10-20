import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class GardenCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('garden')
      .setAliases([])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getSelectedProfile(player, { garden: true });
      const username = FormatUsername(player, profile.gameMode);

      if (profile.garden === null) {
        throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.garden'), { username }));
      }

      const { wheat, carrot, sugarCane, potato, netherWart, pumpkin, melon, mushroom, cocoaBeans, cactus } =
        profile.garden.cropMilestones;

      this.send(
        ReplaceVariables(Translate('minecraft.commands.garden.execute'), {
          username,
          level: profile.garden.level.level,
          wheat: wheat.level,
          carrot: carrot.level,
          sugarCane: sugarCane.level,
          potato: potato.level,
          wart: netherWart.level,
          pumpkin: pumpkin.level,
          melon: melon.level,
          mushroom: mushroom.level,
          cocoa: cocoaBeans.level,
          cactus: cactus.level
        })
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default GardenCommand;
