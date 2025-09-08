import ConfigInstance from '../Private/ConfigInstance';
import StringSelectionOption from '../Options/StringSelection';
// eslint-disable-next-line import/no-cycle
import { getSupportedLanguages, getUserLanguage } from '../../Private/Translate';
import { getSupportedTimezones, getUserTimezone } from '../../Private/TimeZones';

class MiscConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('misc', update);
    this.updateData();
    this.setValue('lang', new StringSelectionOption(getUserLanguage(), getSupportedLanguages()), false);
    this.setValue('timezone', new StringSelectionOption(getUserTimezone(), getSupportedTimezones()), false);
  }
}

export default MiscConfig;
