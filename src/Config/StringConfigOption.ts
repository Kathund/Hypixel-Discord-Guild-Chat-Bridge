import ConfigOption from './Private/ConfigOption';
import type { StringConfigJSON } from '../types/Configs';

class StringOption extends ConfigOption<string> {
  constructor(defaultValue: string, value: string = defaultValue) {
    super('string', defaultValue, value);
  }

  toJSON(): StringConfigJSON {
    return { ...super.toJSON() };
  }
}

export default StringOption;
