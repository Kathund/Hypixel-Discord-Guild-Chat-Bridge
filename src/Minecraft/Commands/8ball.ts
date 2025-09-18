import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class EightBallCommand extends Command {
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('8ball')
      .setAliases(['8b'])
      .setOptions([new CommandDataOption().setName('question').setRequired(true)]);
  }

  override async execute(player: string, message: string) {
    try {
      if (this.getArgs(message).length === 0) throw new Error(Translate('minecraft.commands.8ball.execute.error'));
      const request = await fetch('https://www.eightballapi.com/api');
      if (request.status !== 200) throw new Error(Translate('minecraft.commands.8ball.execute.error'));
      const data = await request.json();
      if (data === undefined) throw new Error(Translate('minecraft.commands.8ball.execute.error'));
      this.send(`${data.reading}`);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
    }
  }
}

export default EightBallCommand;
