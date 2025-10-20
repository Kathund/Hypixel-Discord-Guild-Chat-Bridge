import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class CrimsonIsleCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('crimsonisle')
      .setAliases(['crimson', 'nether', 'isle'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getSelectedProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const { faction, barbariansReputation, magesReputation } = profile.me.crimsonIsle;

      this.send(
        ReplaceVariables(Translate('minecraft.commands.crimsonisle.execute'), {
          username,
          faction: Translate(`minecraft.commands.crimsonisle.execute.${faction}`),
          barbariansReputation: FormatNumber(barbariansReputation),
          magesReputation: FormatNumber(magesReputation)
        })
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default CrimsonIsleCommand;
