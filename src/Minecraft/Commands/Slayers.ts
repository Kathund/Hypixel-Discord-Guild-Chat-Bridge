import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getLatestProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class SlayersCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('slayer')
      .setAliases(['slayers'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;
      const profile = await getLatestProfile(player);
      const username = FormatUsername(player, profile.gameMode);
      const { blaze, enderman, spider, vampire, wolf, zombie } = profile.me.slayers;
      this.send(
        ReplaceVariables(Translate('minecraft.commands.slayer.execute'), {
          username,
          blazeLevel: blaze.level.level,
          blazeXp: FormatNumber(blaze.level.xp),
          endermanLevel: enderman.level.level,
          endermanXp: FormatNumber(enderman.level.xp),
          spiderLevel: spider.level.level,
          spiderXp: FormatNumber(spider.level.xp),
          vampireLevel: vampire.level.level,
          vampireXp: FormatNumber(vampire.level.xp),
          wolfLevel: wolf.level.level,
          wolfXp: FormatNumber(wolf.level.xp),
          zombieLevel: zombie.level.level,
          zombieXp: FormatNumber(zombie.level.xp)
        })
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default SlayersCommand;
