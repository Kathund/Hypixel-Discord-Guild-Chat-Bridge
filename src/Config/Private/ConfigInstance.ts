import ArrayOption from '../ArrayConfigOption';
import BooleanOption from '../BooleanConfigOption';
import CommandOption from '../CommandConfigOption';
import ConfigOption from './ConfigOption';
import HypixelDiscordGuildBridgeError from '../../Private/Error';
import NumberOption from '../NumberConfigOption';
import StringOption from '../StringConfigOption';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { sortJSON } from '../../Utils/JSONUtils';
import type { ConfigJSON } from '../../types/Configs';

const baseData: Record<string, ConfigJSON> = {
  '!!': new StringOption('DO NOT TOUCH THIS FILE').toJSON(),
  '!!!': new StringOption('MANUALLY EDITING OR CHANGING THIS FILE WILL BREAK STUFF').toJSON()
};

class ConfigInstance {
  readonly name: string;
  declare protected data: Record<string, ConfigJSON>;
  constructor(name: string, update: boolean = false) {
    this.name = name;
    this.data = { ...baseData } as Record<string, ConfigJSON>;
    if (!existsSync('./data/config')) mkdirSync('./data/config/', { recursive: true });

    if (update) setInterval(() => this.updateData(), 2 * 60 * 1000);
    if (update) setInterval(() => this.save(), 2 * 60 * 1000);
  }

  private checkConfig(): void {
    if (!existsSync('./data/config')) mkdirSync('./data/config/', { recursive: true });
    if (!existsSync(`./data/config/${this.name}.json`)) {
      writeFileSync(`./data/config/${this.name}.json`, JSON.stringify({ ...baseData }, null, 2));
    }
  }

  updateData(): void {
    this.checkConfig();
    const configFile = readFileSync(`./data/config/${this.name}.json`);
    if (!configFile) throw new HypixelDiscordGuildBridgeError(`The ${this.name} config file doesn't exist`);
    const config = JSON.parse(configFile.toString('utf8'));
    if (!config) throw new HypixelDiscordGuildBridgeError(`The ${this.name} config file is malformed`);
    config['!!'] = baseData['!!'];
    config['!!!'] = baseData['!!!'];
    Object.keys(config).forEach((configKey) => {
      const data = config[configKey];
      if (ConfigOption.isStringConfigJSON(data)) {
        this.setValue(configKey, new StringOption(data.defaultValue, data.value), false);
      }
      if (ConfigOption.isNumberConfigJSON(data)) {
        this.setValue(configKey, new NumberOption(data.defaultValue, data.value, data.max, data.min), false);
      }
    });
  }

  setValue(name: string, value: ConfigOption, override: boolean = true): this {
    if (override) {
      this.data[name] = value.toJSON();
    } else if (this.data[name] === undefined) {
      this.data[name] = value.toJSON();
    }
    return this.save();
  }

  getValue(
    value: string
  ): ArrayOption<unknown> | CommandOption | BooleanOption | StringOption | NumberOption | undefined {
    const data = this.data[value];
    if (!data) return undefined;

    if (ConfigOption.isArrayConfigJSON(data)) {
      return new ArrayOption(data.defaultValue, data.value);
    }

    if (ConfigOption.isBooleanConfigJSON(data)) {
      return new BooleanOption(data.defaultValue, data.value);
    }

    if (ConfigOption.isCommandConfigJSON(data)) {
      return new CommandOption(data.defaultValue, data.value);
    }

    if (ConfigOption.isNumberConfigJSON(data)) {
      return new NumberOption(data.defaultValue, data.value, data.max, data.min);
    }

    if (ConfigOption.isStringConfigJSON(data)) {
      return new StringOption(data.defaultValue, data.value);
    }

    return undefined;
  }

  save(): this {
    this.checkConfig();
    writeFileSync(`./data/config/${this.name}.json`, JSON.stringify(sortJSON(this.data), null, 2));
    return this;
  }
}

export default ConfigInstance;
