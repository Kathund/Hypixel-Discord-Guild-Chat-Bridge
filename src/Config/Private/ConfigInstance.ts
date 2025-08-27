import BaseConfigInstance from './BaseConfigInstance';
import ConfigOption from './ConfigOption';
import HypixelDiscordGuildBridgeError from '../../Private/Error';
import StringOption from '../Options/String';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { ConfigInstanceData } from '../../types/Configs';

const baseData: ConfigInstanceData = {
  '!!': new StringOption('DO NOT TOUCH THIS FILE').toJSON(),
  '!!!': new StringOption('MANUALLY EDITING OR CHANGING THIS FILE WILL BREAK STUFF').toJSON()
};

class ConfigInstance extends BaseConfigInstance {
  readonly name: string;
  declare protected data: ConfigInstanceData;
  constructor(name: string, update: boolean = false) {
    super(baseData);
    this.name = name;
    this.data = { ...baseData } as ConfigInstanceData;
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
      const data = BaseConfigInstance.getConfigOption(config[configKey]);
      if (data !== undefined) this.setValue(configKey, data, false);
    });
  }

  setValue(name: string, value: ConfigOption, override: boolean = true): this {
    super.setValue(name, value, override);
    return this.save();
  }

  save(): this {
    this.checkConfig();
    writeFileSync(`./data/config/${this.name}.json`, JSON.stringify(this.toJSON(true), null, 2));
    return this;
  }
}

export default ConfigInstance;
