import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { FormatError } from '../../Utils/MiscUtils.js';
import { FormatNumber, ReplaceVariables } from '../../Utils/StringUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class CalculateCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('calculate')
      .setAliases(['math', 'calc'])
      .setOptions([
        new CommandDataOption().setName('calculation').setDescription('Any kind of math equation').setRequired(true)
      ]);
  }

  override execute(player: string, message: string) {
    try {
      const calculation = message.replace(/[^-()\d/*+.]/g, '');
      const answer = eval(calculation);
      if (answer === Infinity) return this.send(Translate('minecraft.commands.calculate.execute.infinity'));
      return this.send(
        ReplaceVariables(
          Translate(
            answer > 1000000 ? 'minecraft.commands.calculate.execute.long' : 'minecraft.commands.calculate.execute'
          ),
          { calculation, answer: FormatNumber(answer), rawAnswer: answer.toLocaleString() }
        )
      );
    } catch (error) {
      if (error instanceof Error) this.send(FormatError(error));
    }
  }
}

export default CalculateCommand;
