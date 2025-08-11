import CommandsConfig from './Configs/CommandsConfig';
import DebugConfig from './Configs/DebugConfig';
import MiscConfig from './Configs/MiscConfig';
import { existsSync, mkdirSync } from 'node:fs';
import type Application from '../Application';

class ConfigManager {
  readonly Application: Application;
  declare misc: MiscConfig;
  declare debug: DebugConfig;
  declare commands: CommandsConfig;
  constructor(app: Application) {
    this.Application = app;
    if (!existsSync('./data')) mkdirSync('./data/', { recursive: true });
    if (!existsSync('./data/config')) mkdirSync('./data/config/', { recursive: true });
    this.misc = new MiscConfig(true);
    this.debug = new DebugConfig(true);
    this.commands = new CommandsConfig(true);
  }
}

export default ConfigManager;
