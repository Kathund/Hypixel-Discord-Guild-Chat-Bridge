import ConfigInstance from '../Private/ConfigInstance';
import NumberOption from '../NumberConfigOption';

class DebugConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('debug', update);
    this.updateData();
    this.setValue('version', new NumberOption(1), false);
  }
}

export default DebugConfig;
