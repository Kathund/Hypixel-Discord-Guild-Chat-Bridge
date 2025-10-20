import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class EssenceCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('essence')
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getSelectedProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const {
        crimsonEssence,
        diamondEssence,
        dragonEssence,
        goldEssence,
        iceEssence,
        spiderEssence,
        witherEssence,
        undeadEssence
      } = profile.me.currencies;

      this.send(
        ReplaceVariables(Translate('minecraft.commands.essence.execute'), {
          username,
          crimson: FormatNumber(crimsonEssence),
          diamond: FormatNumber(diamondEssence),
          dragon: FormatNumber(dragonEssence),
          gold: FormatNumber(goldEssence),
          ice: FormatNumber(iceEssence),
          spider: FormatNumber(spiderEssence),
          wither: FormatNumber(witherEssence),
          undead: FormatNumber(undeadEssence)
        })
      );
    } catch (error) {
      console.error(error);

      this.send(`[ERROR] ${error}`);
    }
  }
}

export default EssenceCommand;
