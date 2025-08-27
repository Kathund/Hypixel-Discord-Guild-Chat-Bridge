import ConfigInstance from '../Private/ConfigInstance';
import StringSelectionOption from '../Options/StringSelection';
// eslint-disable-next-line import/no-cycle
import { getSupportedLanguages } from '../../Private/Translate';

class MiscConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('misc', update);
    this.updateData();
    this.setValue('lang', new StringSelectionOption('en_us', getSupportedLanguages()), false);
    const timezones = Intl.supportedValuesOf('timeZone');
    timezones.push('UTC');
    this.setValue('timezone', new StringSelectionOption('UTC', timezones), false);
  }
}

export default MiscConfig;
