import ArrayOption from '../Options/Array';
import BooleanOption from '../Options/Boolean';
import ConfigOption from './ConfigOption';
import InternalOption from '../Options/Internal';
import NumberOption from '../Options/Number';
import StringOption from '../Options/String';
import StringSelectionOption from '../Options/StringSelection';
import SubConfigOption from '../Options/SubConfig';
import { sortJSON } from '../../Utils/JSONUtils';
import type { ConfigInstanceData, ConfigJSON } from '../../types/Configs';

class BaseConfigInstance {
  declare protected data: ConfigInstanceData;
  constructor(data: ConfigInstanceData = {}) {
    this.data = { ...data } as ConfigInstanceData;
  }

  setValue(name: string, value: ConfigOption, override: boolean = true): this {
    if (override) {
      this.data[name] = value.toJSON();
    } else if (this.data[name] === undefined) {
      this.data[name] = value.toJSON();
    }

    if (value.isStringSelectionOption()) {
      const foundData = this.getValue(name);
      if (foundData === undefined || !foundData.isStringSelectionOption()) return this;
      const fixed = foundData.toJSON();
      fixed.options = value.getOptions();
      this.data[name] = fixed;
    }
    return this;
  }

  static getConfigOption(data: ConfigJSON<unknown>) {
    if (ConfigOption.isArrayConfigJSON(data)) {
      return new ArrayOption(data.defaultValue, data.value);
    }

    if (ConfigOption.isBooleanConfigJSON(data)) {
      return new BooleanOption(data.defaultValue, data.value);
    }

    if (ConfigOption.isInternalConfigJSON(data)) {
      return new InternalOption(data.defaultValue, data.value);
    }

    if (ConfigOption.isNumberConfigJSON(data)) {
      return new NumberOption(data.defaultValue, data.value, data.max, data.min);
    }

    if (ConfigOption.isStringConfigJSON(data)) {
      return new StringOption(data.defaultValue, data.value);
    }

    if (ConfigOption.isStringSelectionConfigJSON(data)) {
      return new StringSelectionOption(data.defaultValue, data.options, data.value);
    }

    if (ConfigOption.isSubConfigConfigJSON(data)) {
      return new SubConfigOption(data.defaultValue, data.value);
    }

    return undefined;
  }

  getValue(
    value: string
  ):
    | ArrayOption<unknown>
    | BooleanOption
    | InternalOption
    | NumberOption
    | StringOption
    | StringSelectionOption
    | SubConfigOption
    | undefined {
    const data = this.data[value];
    if (!data) return undefined;
    return BaseConfigInstance.getConfigOption(data);
  }

  toJSON(withWarnings: boolean = false): ConfigInstanceData {
    return sortJSON(
      Object.fromEntries(Object.entries(this.data).filter(([key]) => withWarnings || (key !== '!!' && key !== '!!!')))
    );
  }
}

export default BaseConfigInstance;
