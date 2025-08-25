import ConfigOption from '../Private/ConfigOption';
import type { ArrayConfigJSON } from '../../types/Configs';

class ArrayOption<T> extends ConfigOption<T[]> {
  constructor(defaultValue: T[], value: T[] = defaultValue) {
    super('array', defaultValue, value);
  }

  toJSON(): ArrayConfigJSON<T> {
    return { ...super.toJSON() };
  }
}

export default ArrayOption;
