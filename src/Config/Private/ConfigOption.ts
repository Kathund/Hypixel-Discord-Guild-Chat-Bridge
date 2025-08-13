import type ArrayOption from '../ArrayConfigOption';
import type BooleanOption from '../BooleanConfigOption';
import type CommandOption from '../CommandConfigOption';
import type NumberOption from '../NumberConfigOption';
import type StringOption from '../StringConfigOption';
import type {
  ArrayConfigJSON,
  BooleanConfigJSON,
  CommandConfigJSON,
  ConfigJSON,
  NumberConfigJSON,
  StringConfigJSON
} from '../../types/Configs';

class ConfigOption<OptionType = unknown> {
  declare readonly type: string;
  declare private defaultValue: OptionType;
  declare private value: OptionType;
  constructor(type: string, defaultValue: OptionType, value: OptionType) {
    this.type = type;
    this.defaultValue = defaultValue;
    this.value = value;
  }

  getType(): string {
    return this.type;
  }

  getDefaultValue(): OptionType {
    return this.defaultValue;
  }

  getValue(): OptionType {
    return this.value;
  }

  resetValue(): this {
    this.value = this.getDefaultValue();
    return this;
  }

  setValue(value: OptionType): this {
    this.value = value;
    return this;
  }

  toJSON(): ConfigJSON<OptionType> {
    return {
      type: this.type,
      defaultValue: this.defaultValue,
      value: this.value
    };
  }

  isArrayOption(): this is ArrayOption<unknown> {
    return this.getType() === 'array';
  }

  static isArrayConfigJSON(option: ConfigJSON): option is ArrayConfigJSON<unknown> {
    return option.type === 'array';
  }

  isBooleanOption(): this is BooleanOption {
    return this.getType() === 'boolean';
  }

  static isBooleanConfigJSON(option: ConfigJSON): option is BooleanConfigJSON {
    return option.type === 'boolean';
  }

  isCommandOption(): this is CommandOption {
    return this.getType() === 'command';
  }

  static isCommandConfigJSON(option: ConfigJSON): option is CommandConfigJSON {
    return option.type === 'command';
  }

  isNumberOption(): this is NumberOption {
    return this.getType() === 'number';
  }

  static isNumberConfigJSON(option: ConfigJSON): option is NumberConfigJSON {
    return option.type === 'number';
  }

  isStringOption(): this is StringOption {
    return this.getType() === 'string';
  }

  static isStringConfigJSON(option: ConfigJSON): option is StringConfigJSON {
    return option.type === 'string';
  }
}

export default ConfigOption;
