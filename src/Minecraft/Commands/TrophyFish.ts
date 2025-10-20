import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';
import type { SkyBlockMemberCrimsonIsleTrophyFish, SkyBlockMemberCrimsonIsleTrophyFishFish } from 'hypixel-api-reborn';

class TrophyFishCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('trophyfish')
      .setAliases(['tf', 'trophyfishing', 'trophy'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getSelectedProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const trophyFishing = profile.me.crimsonIsle.trophyFishing;
      const { bronze, silver, gold, diamond, total } = trophyFishing.caught;

      let uniqueBronze = 0;
      let uniqueSilver = 0;
      let uniqueGold = 0;
      let uniqueDiamond = 0;

      (Object.keys(trophyFishing) as (keyof SkyBlockMemberCrimsonIsleTrophyFish)[])
        .filter((fish) => !['toString', 'rank', 'caught'].includes(fish as string))
        .forEach((fishName) => {
          const fish = trophyFishing[fishName] as SkyBlockMemberCrimsonIsleTrophyFishFish;
          if (fish.bronze > 1) uniqueBronze++;
          if (fish.gold > 1) uniqueSilver++;
          if (fish.gold > 1) uniqueGold++;
          if (fish.diamond > 1) uniqueDiamond++;
        });

      this.send(
        ReplaceVariables(Translate('minecraft.commands.trophyfish.execute'), {
          username,
          rank: trophyFishing.rank,
          uniqueBronze,
          totalBronze: FormatNumber(bronze),
          uniqueSilver,
          totalSilver: FormatNumber(silver),
          uniqueGold,
          totalGold: FormatNumber(gold),
          uniqueDiamond,
          totalDiamond: FormatNumber(diamond),
          total: FormatNumber(total)
        })
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default TrophyFishCommand;
