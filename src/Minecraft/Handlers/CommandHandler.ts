import StringOption from '../../Config/Options/String.js';
import Translate, { unTranslate } from '../../Private/Translate.js';
import { Collection } from 'discord.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import { readdirSync } from 'node:fs';
import type Command from '../Private/Command.js';
import type MinecraftManager from '../MinecraftManager.js';
import type { SubConfigConfigJSON } from '../../Types/Configs.js';

class CommandHandler {
  private readonly minecraft: MinecraftManager;
  private readonly commands: Collection<string, Command> = new Collection<string, Command>();
  constructor(minecraft: MinecraftManager) {
    this.minecraft = minecraft;
  }

  handle(player: string, message: string, officer: boolean) {
    const prefix = (
      this.minecraft.Application.config.minecraft.getValue('prefix') || new StringOption('!')
    ).getValue() as string;
    if (!message.startsWith(prefix)) return;

    const args = message.slice(prefix.length).trim().split(/ +/);
    if (!args) return;
    const commandName = args.shift() ?? ''.toLowerCase();
    const command =
      this.commands.get(commandName) ??
      this.commands.find((cmd) => cmd.data.getAliases() && cmd.data.getAliases().includes(commandName));

    if (command === undefined) return;

    console.minecraft(
      ReplaceVariables(Translate('minecraft.commands.execute'), { player, command: command.data.getName(), message })
    );
    command.officer = officer;
    command.execute(player, message);
  }

  async deployCommands(): Promise<void> {
    if (!this.minecraft.bot) return;
    const commandConfig = this.minecraft.Application.config.minecraft.getValue('commands');
    if (!commandConfig || !commandConfig.isSubConfigConfig()) return;

    this.commands.clear();

    const commandFiles = readdirSync('./src/Minecraft/Commands');
    for (const file of commandFiles) {
      const command: Command = new (await import(`../Commands/${file}`)).default(this.minecraft);
      if (!command.data.getName()) continue;
      const untranslatedName = unTranslate(command.data.getName());
      if (untranslatedName.includes('|')) continue;
      const commandConfigOption = commandConfig.getValue()?.[Translate(untranslatedName, 'en_us')] as
        | SubConfigConfigJSON
        | undefined;
      if (!commandConfigOption?.value?.enabled?.value) continue;
      this.commands.set(command.data.getName(), command);
    }

    console.minecraft(ReplaceVariables(Translate('minecraft.commands.load.finished'), { amount: this.commands.size }));
  }
}

export default CommandHandler;
