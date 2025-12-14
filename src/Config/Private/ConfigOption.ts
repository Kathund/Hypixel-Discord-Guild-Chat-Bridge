import type ArrayOption from '../Options/Array.js';
import type BooleanOption from '../Options/Boolean.js';
import type InternalOption from '../Options/Internal.js';
import type NumberOption from '../Options/Number.js';
import type StringOption from '../Options/String.js';
import type StringSelectionOption from '../Options/StringSelection.js';
import type SubConfigOption from '../Options/SubConfig.js';
import type {
  ArrayConfigJSON,
  BooleanConfigJSON,
  ConfigJSON,
  InternalConfigJSON,
  NumberConfigJSON,
  StringConfigJSON,
  StringSelectionConfigJSON,
  StringSelectionConfigJSONWeb,
  SubConfigConfigJSON
} from '../../Types/Configs.js';

class ConfigOption<OptionType = unknown> {
  private readonly type: string;
  private defaultValue: OptionType;
  private value: OptionType;
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
    return { type: this.type, defaultValue: this.defaultValue, value: this.value };
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

  isInternalOption(): this is InternalOption {
    return this.getType() === 'internal';
  }

  static isInternalConfigJSON(option: ConfigJSON): option is InternalConfigJSON {
    return option.type === 'internal';
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

  isStringSelectionOption(): this is StringSelectionOption {
    return this.getType() === 'stringSelection';
  }

  static isStringSelectionConfigJSON(option: ConfigJSON): option is StringSelectionConfigJSON {
    return option.type === 'stringSelection';
  }

  static isStringSelectionConfigJSONWeb(option: ConfigJSON): option is StringSelectionConfigJSONWeb {
    return option.type === 'stringSelection';
  }

  isSubConfigConfig(): this is SubConfigOption {
    return this.getType() === 'subConfig';
  }

  static isSubConfigConfigJSON(option: ConfigJSON): option is SubConfigConfigJSON {
    return option.type === 'subConfig';
  }
}

export default ConfigOption;
