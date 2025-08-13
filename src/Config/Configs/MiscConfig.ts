import ConfigInstance from '../Private/ConfigInstance';
import StringOption from '../StringConfigOption';

class MiscConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('misc', update);
    this.updateData();
    this.setValue('lang', new StringOption('en_us'), false);
  }
}

export default MiscConfig;
