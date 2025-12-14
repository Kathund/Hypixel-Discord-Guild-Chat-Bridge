import ConfigOption from '../Private/ConfigOption.js';
import type { NumberConfigJSON } from '../../Types/Configs.js';

class NumberOption extends ConfigOption<number> {
  private max: number;
  private min: number;
  constructor(defaultValue: number, value: number = defaultValue, max: number = -1, min: number = -1) {
    super('number', defaultValue, value);
    this.max = max;
    this.min = min;
  }

  getMax(): number {
    return this.max;
  }

  getMin(): number {
    return this.min;
  }

  isValidNumber(value: number = this.getValue()): boolean {
    return (this.min === -1 || value >= this.min) && (this.max === -1 || value <= this.max);
  }

  override toJSON(): NumberConfigJSON {
    return { ...super.toJSON(), max: this.getMax(), min: this.getMin() };
  }
}

export default NumberOption;
