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
  constructor(update: boolean = true) {
    if (!existsSync('./data/config')) mkdirSync('./data/config/', { recursive: true });
    this.debug = new DebugConfig(update);
    this.discord = new DiscordConfig(update);
    this.minecraft = new MinecraftConfig(update);
    this.misc = new MiscConfig(update);
  }
}

export default ConfigManager;
