import ConfigOption from '../Private/ConfigOption';
import type { BooleanConfigJSON } from '../../types/Configs';

class BooleanOption extends ConfigOption<boolean> {
  constructor(defaultValue: boolean, value: boolean = defaultValue) {
    super('boolean', defaultValue, value);
  }

  toJSON(): BooleanConfigJSON {
    return { ...super.toJSON() };
  }
}

export default BooleanOption;
