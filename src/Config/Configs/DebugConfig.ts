import ConfigInstance from '../Private/ConfigInstance';
import NumberOption from '../Options/Number';
import StringSelectionOption from '../Options/StringSelection';

class DebugConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('debug', update);
    this.updateData();
    this.setValue('version', new NumberOption(1), false);
    this.setValue('debug_channel', new StringSelectionOption('', ['prefill_channels']), false);
  }
}

export default DebugConfig;
