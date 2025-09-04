import DebugConfig from './Configs/DebugConfig';
import DiscordConfig from './Configs/DiscordConfig';
import MinecraftConfig from './Configs/MinecraftConfig';
import MiscConfig from './Configs/MiscConfig';
import { existsSync, mkdirSync } from 'node:fs';

class ConfigManager {
  declare debug: DebugConfig;
  declare discord: DiscordConfig;
  declare minecraft: MinecraftConfig;
  declare misc: MiscConfig;
  constructor() {
    if (!existsSync('./data/config')) mkdirSync('./data/config/', { recursive: true });
    this.debug = new DebugConfig(true);
    this.discord = new DiscordConfig(true);
    this.minecraft = new MinecraftConfig(true);
    this.misc = new MiscConfig(true);
  }
}

export default ConfigManager;
