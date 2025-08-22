import CommandsConfig from './Configs/CommandsConfig';
import DebugConfig from './Configs/DebugConfig';
import DiscordConfig from './Configs/DiscordConfig';
import MinecraftConfig from './Configs/MinecraftConfig';
import MiscConfig from './Configs/MiscConfig';
import { existsSync, mkdirSync } from 'node:fs';
import type Application from '../Application';

class ConfigManager {
  private readonly Application: Application;
  declare commands: CommandsConfig;
  declare debug: DebugConfig;
  declare discord: DiscordConfig;
  declare minecraft: MinecraftConfig;
  declare misc: MiscConfig;
  constructor(app: Application) {
    this.Application = app;
    if (!existsSync('./data')) mkdirSync('./data/', { recursive: true });
    if (!existsSync('./data/config')) mkdirSync('./data/config/', { recursive: true });
    this.commands = new CommandsConfig(true);
    this.debug = new DebugConfig(true);
    this.discord = new DiscordConfig(true);
    this.minecraft = new MinecraftConfig(true);
    this.misc = new MiscConfig(true);
  }
}

export default ConfigManager;
