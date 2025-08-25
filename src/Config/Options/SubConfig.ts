import ConfigOption from '../Private/ConfigOption';
import type { ConfigInstanceData, SubConfigConfigJSON } from '../../types/Configs';

class SubConfigOption extends ConfigOption<ConfigInstanceData> {
  constructor(defaultValue: ConfigInstanceData, value: ConfigInstanceData = defaultValue) {
    super('subConfig', defaultValue, value);
  }

  toJSON(): SubConfigConfigJSON {
    return { ...super.toJSON() };
  }
}

export default SubConfigOption;
