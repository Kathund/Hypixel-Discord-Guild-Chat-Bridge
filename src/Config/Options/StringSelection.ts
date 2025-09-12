import ConfigOption from '../Private/ConfigOption.js';
import type { StringSelectionConfigJSON } from '../../Types/Configs.js';

class StringSelectionOption extends ConfigOption<string> {
  private options: string[];
  constructor(defaultValue: string, options: string[], value: string = defaultValue) {
    super('stringSelection', defaultValue, value);
    this.options = options;
  }

  getOptions(): string[] {
    return this.options;
  }

  setOptions(options: string[]): this {
    this.options = options;
    return this;
  }

  override toJSON(): StringSelectionConfigJSON {
    return { ...super.toJSON(), options: this.options };
  }
}

export default StringSelectionOption;
