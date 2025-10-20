import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class HotmCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('hotm')
      .setAliases(['mining'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getSelectedProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const { hotm, powder, pickaxeAbility } = profile.me.mining;
      const { level } = hotm;

      this.send(
        ReplaceVariables(Translate('minecraft.commands.hotm.execute'), {
          username,
          level: level.level,
          mithril: FormatNumber(powder.mithril.total),
          gemstone: FormatNumber(powder.gemstone.total),
          glacite: FormatNumber(powder.glacite.total),
          pickaxeAbility
        })
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default HotmCommand;
