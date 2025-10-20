import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class KuudraCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('kuudra')
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getSelectedProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const { basicCompletions, hotCompletions, burningCompletions, fieryCompletions, infernalCompletions } =
        profile.me.crimsonIsle.kuudra;

      this.send(
        ReplaceVariables(Translate('minecraft.commands.kuudra.execute'), {
          username,
          basic: FormatNumber(basicCompletions),
          hot: FormatNumber(hotCompletions),
          burning: FormatNumber(burningCompletions),
          fiery: FormatNumber(fieryCompletions),
          infernal: FormatNumber(infernalCompletions)
        })
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default KuudraCommand;
