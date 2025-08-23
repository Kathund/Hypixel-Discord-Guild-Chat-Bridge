import ArrayOption from '../ArrayConfigOption';
import BooleanOption from '../BooleanConfigOption';
import CommandOption from '../CommandConfigOption';
import ConfigOption from './ConfigOption';
import HypixelDiscordGuildBridgeError from '../../Private/Error';
import NumberOption from '../NumberConfigOption';
import StringOption from '../StringConfigOption';
import StringSelectionOption from '../StringSelectionConfigOption';
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
      const data = ConfigInstance.getConfigOption(config[configKey]);
      if (data !== undefined) this.setValue(configKey, data, false);
    });
  }

  setValue(name: string, value: ConfigOption | ConfigInstance, override: boolean = true): this {
    if (value instanceof ConfigInstance) {
      //console.log(this.data);
      this.data[value.name] = {
        type: 'subconfig',
        defaultValue: {},
        value: value.toJSON(true)
      } as ConfigJSON<unknown>;
      //console.log(`Config Instance: ${JSON.stringify(this.data, null, 2)}`);
      //console.log(value.toJSON());
    } else {
      if (override) {
        this.data[name] = value.toJSON();
      } else if (this.data[name] === undefined) {
        this.data[name] = value.toJSON();
      }

      if (value.isStringSelectionOption()) {
        const foundData = this.getValue(name);
        if (foundData === undefined || !foundData.isStringSelectionOption()) return this.save();
        const fixed = foundData.toJSON();
        fixed.options = value.getOptions();
        this.data[name] = fixed;
      }
    }
    return this.save();
  }

  static getConfigOption(data: ConfigJSON<unknown>) {
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

    if (ConfigOption.isStringSelectionConfigJSON(data)) {
      return new StringSelectionOption(data.defaultValue, data.options, data.value);
    }

    return undefined;
  }

  getValue(
    value: string
  ):
    | ArrayOption<unknown>
    | BooleanOption
    | CommandOption
    | NumberOption
    | StringOption
    | StringSelectionOption
    | undefined {
    const data = this.data[value];
    if (!data) return undefined;
    return ConfigInstance.getConfigOption(data);
  }

  toJSON(withWarnings: boolean = false): Record<string, ConfigJSON> {
    return sortJSON(
      Object.fromEntries(Object.entries(this.data).filter(([key]) => withWarnings || (key !== '!!' && key !== '!!!')))
    );
  }

  save(): this {
    this.checkConfig();
    writeFileSync(`./data/config/${this.name}.json`, JSON.stringify(this.toJSON(true), null, 2));
    return this;
  }
}

export default ConfigInstance;
