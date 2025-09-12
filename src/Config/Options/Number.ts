import ConfigOption from '../Private/ConfigOption';
import type { NumberConfigJSON } from '../../Types/Configs';

class NumberOption extends ConfigOption<number> {
  declare private max: number;
  declare private min: number;
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

  toJSON(): NumberConfigJSON {
    return { ...super.toJSON(), max: this.getMax(), min: this.getMin() };
  }
}

export default NumberOption;
