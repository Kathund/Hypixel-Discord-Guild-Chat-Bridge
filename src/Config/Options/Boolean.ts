import ConfigOption from '../Private/ConfigOption.js';
import type { BooleanConfigJSON } from '../../Types/Configs.js';

class BooleanOption extends ConfigOption<boolean> {
  constructor(defaultValue: boolean, value: boolean = defaultValue) {
    super('boolean', defaultValue, value);
  }

  override toJSON(): BooleanConfigJSON {
    return { ...super.toJSON() };
  }
}

export default BooleanOption;
