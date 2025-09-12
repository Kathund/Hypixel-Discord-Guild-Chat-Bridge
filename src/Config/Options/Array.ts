import ConfigOption from '../Private/ConfigOption.js';
import type { ArrayConfigJSON } from '../../Types/Configs.js';

class ArrayOption<T> extends ConfigOption<T[]> {
  constructor(defaultValue: T[], value: T[] = defaultValue) {
    super('array', defaultValue, value);
  }

  addValue(value: T): this {
    this.setValue([...this.getValue(), value]);
    return this;
  }

  removeValue(value: T): this {
    this.setValue(this.getValue().filter((item) => item !== value));
    return this;
  }

  count(): number {
    return this.getValue().length;
  }

  override toJSON(): ArrayConfigJSON<T> {
    return { ...super.toJSON() };
  }
}

export default ArrayOption;
