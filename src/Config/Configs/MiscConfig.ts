import ConfigInstance from '../Private/ConfigInstance';

class MiscConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('misc', update);
    this.updateData();
    this.setValue('lang', 'en_us');
  }
}

export default MiscConfig;
