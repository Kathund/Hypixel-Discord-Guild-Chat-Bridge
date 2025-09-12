import ConfigOption from '../Private/ConfigOption';
import type { InternalConfigJSON } from '../../Types/Configs';

class InternalOption extends ConfigOption<string> {
  constructor(defaultValue: string, value: string = defaultValue) {
    super('internal', defaultValue, value);
  }

  toJSON(): InternalConfigJSON {
    return { ...super.toJSON() };
  }
}

export default InternalOption;
