import ConfigInstance from '../Private/ConfigInstance';

class DebugConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('debug', update);
    this.updateData();
    this.setValue('version', 1);
  }
}

export default DebugConfig;
