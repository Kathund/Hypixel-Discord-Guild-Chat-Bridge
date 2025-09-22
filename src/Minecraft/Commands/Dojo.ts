import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getLatestProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class DojoCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('dojo')
      .setAliases([])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getLatestProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const { belt, control, stamina, discipline, force, mastery, swiftness, tenacity } = profile.me.crimsonIsle.dojo;

      this.send(
        ReplaceVariables(Translate('minecraft.commands.dojo.execute'), {
          username,
          belt: Translate(`minecraft.commands.dojo.execute.${belt}`),
          control: FormatNumber(control.points),
          stamina: FormatNumber(stamina.points),
          discipline: FormatNumber(discipline.points),
          force: FormatNumber(force.points),
          mastery: FormatNumber(mastery.points),
          swiftness: FormatNumber(swiftness.points),
          tenacity: FormatNumber(tenacity.points)
        })
      );
    } catch (error) {
      console.error(error);
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default DojoCommand;
