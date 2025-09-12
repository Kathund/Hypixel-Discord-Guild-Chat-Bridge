import ConfigOption from '../Private/ConfigOption.js';
import type { StringConfigJSON } from '../../Types/Configs.js';

class StringOption extends ConfigOption<string> {
  constructor(defaultValue: string, value: string = defaultValue) {
    super('string', defaultValue, value);
  }

  override toJSON(): StringConfigJSON {
    return { ...super.toJSON() };
  }
}

export default StringOption;
