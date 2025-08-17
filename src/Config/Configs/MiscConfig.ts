import BooleanOption from '../BooleanConfigOption';
import ConfigInstance from '../Private/ConfigInstance';
import NumberOption from '../NumberConfigOption';
import StringOption from '../StringConfigOption';
import StringSelectionOption from '../StringSelectionConfigOption';
// eslint-disable-next-line import/no-cycle
import { getSupportedLanguages } from '../../Private/Translate';

class MiscConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('misc', update);
    this.updateData();
    this.setValue('lang', new StringSelectionOption('en_us', getSupportedLanguages()), false);
    this.setValue('boolean', new BooleanOption(false), false);
    this.setValue('number', new NumberOption(1), false);
    this.setValue('string', new StringOption('fuck'), false);
  }
}

export default MiscConfig;
