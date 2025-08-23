import ConfigInstance from '../Private/ConfigInstance';
import StringOption from '../StringConfigOption';

class FuckConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('fuck', update);
    this.updateData();
    this.setValue('test', new StringOption('test'), false);
  }
}

export default FuckConfig;
