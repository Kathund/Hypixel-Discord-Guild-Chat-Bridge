import ConfigInstance from '../Private/ConfigInstance.js';
import InternalOption from '../Options/Internal.js';
import StringSelectionOption from '../Options/StringSelection.js';
// eslint-disable-next-line import/no-cycle
import { getSupportedLanguages, getUserLanguage } from '../../Private/Translate.js';
import { getSupportedTimezones, getUserTimezone } from '../../Utils/TimeAndDateUtils.js';

class MiscConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('misc', update);
    this.updateData();
    this.setValue('lang', new StringSelectionOption(getUserLanguage(), getSupportedLanguages()), false);
    this.setValue('timezone', new StringSelectionOption(getUserTimezone(), getSupportedTimezones()), false);
    this.setValue('internal_button_export_config', new InternalOption('internal_button_export_config'), false);
    this.setValue('internal_button_import_config', new InternalOption('internal_button_export_config'), false);
  }
}

export default MiscConfig;
