import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getLatestProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class JacobCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('jacob')
      .setAliases(['jacobs', 'jacobcontest', 'contest'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getLatestProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const { gold, silver, bronze } = profile.me.jacobContests.medals;
      const { doubleDrops, farmingLevelCap } = profile.me.jacobContests.perks;

      this.send(
        ReplaceVariables(Translate('minecraft.commands.jacob.execute'), {
          username,
          gold: FormatNumber(gold),
          silver: FormatNumber(silver),
          bronze: FormatNumber(bronze),
          doubleDrops,
          levelCap: farmingLevelCap
        })
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default JacobCommand;
