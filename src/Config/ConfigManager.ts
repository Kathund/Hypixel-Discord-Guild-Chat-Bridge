import BaseConfigInstance from './Private/BaseConfigInstance.js';
import DebugConfig from './Configs/DebugConfig.js';
import DiscordConfig from './Configs/DiscordConfig.js';
import MinecraftConfig from './Configs/MinecraftConfig.js';
import MiscConfig from './Configs/MiscConfig.js';
import zod from 'zod';
import {
  ArrayConfigJSON,
  BooleanConfigJSON,
  ConfigInstanceData,
  InternalConfigJSON,
  NumberConfigJSON,
  StringConfigJSON,
  StringSelectionConfigJSON,
  SubConfigConfigJSON
} from '../Types/Configs.js';
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

  static convertConfigToBase64(): string {
    const configs = new ConfigManager(false);
    const data: { [key: string]: ConfigInstanceData } = {};
    Object.keys(configs)
      .filter((key) => !['Application'].includes(key))
      .forEach((key) => {
        const config = configs[key as keyof typeof configs];
        if (config === undefined) return;
        data[key] = config.toJSON();
      });
    return Buffer.from(JSON.stringify(data), 'utf-8').toString('base64');
  }

  static importConfigFromBase64(base64: string): void {
    const configs = new ConfigManager(false);
    const configNames = Object.keys(configs).filter((key) => !['Application'].includes(key));
    const decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
    Object.keys(decoded).forEach((config) => {
      if (!configNames.includes(config)) return;
      const configData = configs[config as keyof typeof configs];
      if (!configData) return;
      Object.keys(decoded[config]).forEach((option) => {
        const optionData = configData.getValue(option);
        if (!optionData) return;
        switch (decoded[config][option].type) {
          case 'array': {
            const schema = ArrayConfigJSON(zod.unknown());
            const parsed = schema.safeParse(decoded[config][option]);
            if (parsed.success) {
              const parsedOption = BaseConfigInstance.getConfigOption(decoded[config][option]);
              if (parsedOption) configData.setValue(option, parsedOption, true);
            }
            break;
          }
          case 'boolean': {
            const parsed = BooleanConfigJSON.safeParse(decoded[config][option]);
            if (parsed.success) {
              const parsedOption = BaseConfigInstance.getConfigOption(decoded[config][option]);
              if (parsedOption) configData.setValue(option, parsedOption, true);
            }
            break;
          }
          case 'internal': {
            const parsed = InternalConfigJSON.safeParse(decoded[config][option]);
            if (parsed.success) {
              const parsedOption = BaseConfigInstance.getConfigOption(decoded[config][option]);
              if (parsedOption) configData.setValue(option, parsedOption, true);
            }
            break;
          }
          case 'number': {
            const parsed = NumberConfigJSON.safeParse(decoded[config][option]);
            if (parsed.success) {
              const parsedOption = BaseConfigInstance.getConfigOption(decoded[config][option]);
              if (parsedOption) configData.setValue(option, parsedOption, true);
            }
            break;
          }
          case 'string': {
            const parsed = StringConfigJSON.safeParse(decoded[config][option]);
            if (parsed.success) {
              const parsedOption = BaseConfigInstance.getConfigOption(decoded[config][option]);
              if (parsedOption) configData.setValue(option, parsedOption, true);
            }
            break;
          }
          case 'stringSelection': {
            const parsed = StringSelectionConfigJSON.safeParse(decoded[config][option]);
            if (parsed.success) {
              const parsedOption = BaseConfigInstance.getConfigOption(decoded[config][option]);
              if (parsedOption) configData.setValue(option, parsedOption, true);
            }
            break;
          }
          case 'subConfig': {
            const parsed = SubConfigConfigJSON.safeParse(decoded[config][option]);
            if (parsed.success) {
              const parsedOption = BaseConfigInstance.getConfigOption(decoded[config][option]);
              if (parsedOption) configData.setValue(option, parsedOption, true);
            }
            break;
          }
          default: {
            break;
          }
        }
      });
      configData.save();
    });
  }
}

export default ConfigManager;
