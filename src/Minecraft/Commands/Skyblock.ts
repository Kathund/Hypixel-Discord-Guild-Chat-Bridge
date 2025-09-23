import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getLatestProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';
import type { SkyBlockMemberSlayer } from 'hypixel-api-reborn';

class SkyblockCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('skyblock')
      .setAliases(['stats', 'sb'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getLatestProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const { dungeons, slayers, playerData, leveling, inventory, mining } = profile.me;

      const decodedTalismans = await inventory.bags.talisman.decodeData();
      if (!decodedTalismans) throw new Error(ReplaceVariables(Translate('hypixel.api.error.no.profile'), { username }));

      this.send(
        ReplaceVariables(Translate('minecraft.commands.skyblock.execute'), {
          username,
          level: leveling.level,
          skillAverage: FormatNumber(playerData.skills.average, 2),
          slayer: Object.keys(slayers)
            .filter((slayer) => slayer !== 'activeSlayer')
            .map((slayer) => {
              const slayerData: SkyBlockMemberSlayer = slayers[slayer as keyof typeof slayers] as SkyBlockMemberSlayer;
              return ReplaceVariables(Translate('minecraft.commands.skyblock.execute.slayer.format'), {
                level: FormatNumber(slayerData.level.level, 0),
                name: Translate(`minecraft.commands.skyblock.execute.slayer.format.${slayer}`)
              });
            })
            .join(Translate('minecraft.commands.skyblock.execute.slayer.format.join')),
          catacombs: FormatNumber(dungeons.level.level, 2),
          classAverage: FormatNumber(dungeons.classes.average, 2),
          magicalPower: FormatNumber(decodedTalismans.magicalPower, 2),
          hotmLevel: FormatNumber(mining.hotm.level.level, 2)
        })
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default SkyblockCommand;
