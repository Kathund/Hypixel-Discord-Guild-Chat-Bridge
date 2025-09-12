import ConfigOption from '../Private/ConfigOption.js';
import type { InternalConfigJSON } from '../../Types/Configs.js';

class InternalOption extends ConfigOption<string> {
  constructor(defaultValue: string, value: string = defaultValue) {
    super('internal', defaultValue, value);
  }

  override toJSON(): InternalConfigJSON {
    return { ...super.toJSON() };
  }
}

export default InternalOption;
