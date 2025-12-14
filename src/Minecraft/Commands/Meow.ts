import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class MeowCommand extends Command {
  private variations: string[];
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.variations = ['mrrp', 'mrrow', 'miau', 'mauww', 'meep', ':3', 'nja', 'awawa'];
    this.data = new CommandData().setName('meow').setAliases(this.variations);
  }

  override execute(username: string, message: string): void {
    this.send(this.variations[Math.floor(Math.random() * this.variations.length)] || 'meow');
  }
}

export default MeowCommand;
