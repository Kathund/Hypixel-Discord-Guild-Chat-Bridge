import HypixelDiscordGuildBridgeError from '../../Private/Error';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { sortJSON } from '../../Utils/JSONUtils';

const baseData: Record<string, string> = {
  '!!': 'DO NOT TOUCH THIS FILE',
  '!!!': 'MANUALLY EDITING OR CHANGING THIS FILE WILL BREAK STUFF'
};

class ConfigInstance<ConfigType = string | number | boolean> {
  readonly name: string;
  declare protected data: Record<string, ConfigType>;
  constructor(name: string, update: boolean = false) {
    this.name = name;
    this.data = { ...baseData } as Record<string, ConfigType>;
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
    config['!!'] = 'DO NOT TOUCH THIS FILE';
    config['!!!'] = 'MANUALLY EDITING OR CHANGING THIS FILE WILL BREAK STUFF';
    Object.keys(config).forEach((configKey) => {
      if (this.data[configKey] === undefined) this.data[configKey] = config[configKey];
    });
  }

  setValue(name: string, value: ConfigType): this {
    if (this.data[name] === undefined) this.data[name] = value;
    this.save();
    return this;
  }

  updateValue(name: string, value: ConfigType): this {
    this.data[name] = value;
    this.save();
    return this;
  }

  getValue(name: string): ConfigType | undefined {
    return this.data[name];
  }

  save(): this {
    this.checkConfig();
    writeFileSync(`./data/config/${this.name}.json`, JSON.stringify(sortJSON(this.data), null, 2));
    return this;
  }
}

export default ConfigInstance;
