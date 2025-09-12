import ConfigOption from '../Private/ConfigOption.js';
import type { ConfigInstanceData, SubConfigConfigJSON } from '../../Types/Configs.js';

class SubConfigOption extends ConfigOption<ConfigInstanceData> {
  constructor(defaultValue: ConfigInstanceData, value: ConfigInstanceData = defaultValue) {
    super('subConfig', defaultValue, value);
  }

  override toJSON(): SubConfigConfigJSON {
    return { ...super.toJSON() };
  }
}

export default SubConfigOption;
