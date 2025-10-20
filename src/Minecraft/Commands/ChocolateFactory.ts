import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatNumber, FormatUsername, ReplaceVariables } from '../../Utils/StringUtils.js';
import { getSelectedProfile } from '../../Utils/HypixelUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class ChocolateFactoryCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('chocolatefactory')
      .setAliases(['cf', 'factory', 'chocolate'])
      .setOptions([new CommandDataOption().setName('username').setRequired(false)]);
  }

  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      player = args[0] || player;

      const profile = await getSelectedProfile(player);
      const username = FormatUsername(player, profile.gameMode);

      const { prestige, totalChocolate, currentChocolate, employees } = profile.me.chocolateFactory;
      const { bro, cousin, sis, father, grandma, dog, uncle } = employees;
      this.send(
        ReplaceVariables(Translate('minecraft.commands.chocolatefactory.execute'), {
          username,
          prestige,
          totalChocolate: FormatNumber(totalChocolate),
          currentChocolate: FormatNumber(currentChocolate),
          employees,
          bro,
          cousin,
          sis,
          father,
          grandma,
          dog,
          uncle
        })
      );
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default ChocolateFactoryCommand;
