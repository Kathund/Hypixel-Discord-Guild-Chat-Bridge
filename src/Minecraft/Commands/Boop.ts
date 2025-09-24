import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import CommandDataOption from '../Private/CommandDataOption.js';
import Translate from '../../Private/Translate.js';
import { Delay } from '../../Utils/MiscUtils.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type { MinecraftManagerWithBot } from '../../Types/Minecraft.js';

class BoopCommand extends Command {
  isOnCooldown: boolean;
  constructor(minecraft: MinecraftManagerWithBot) {
    super(minecraft);
    this.data = new CommandData()
      .setName('boop')
      .setAliases(['bp'])
      .setOptions([new CommandDataOption().setName('username').setRequired(true)]);

    this.isOnCooldown = false;
  }

  // CREDITS: by @Zickles (https://github.com/Zickles)
  override async execute(player: string, message: string) {
    try {
      const args = this.getArgs(message);
      if (args.length === 0) throw new Error(Translate('minecraft.commands.boop.execute.error.player'));
      if (this.isOnCooldown) {
        throw new Error(ReplaceVariables(Translate('minecraft.commands.boop.execute.error.cooldown'), { player }));
      }

      this.isOnCooldown = true;
      this.minecraft.bot.chat(`/boop ${args[0]}`);
      await Delay(1000);
      this.minecraft.bot.chat(
        `/msg ${args[0]} ${ReplaceVariables(Translate('minecraft.commands.boop.execute.boop'), { player })}`
      );
      await Delay(1000);
      this.send(ReplaceVariables(Translate('minecraft.commands.boop.execute'), { player: args[0] }));
      setTimeout(() => (this.isOnCooldown = false), 30000);
    } catch (error) {
      this.send(`[ERROR] ${error}`);
      this.isOnCooldown = false;
    }
  }
}

export default BoopCommand;
