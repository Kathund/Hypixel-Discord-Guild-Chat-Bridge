import BooleanOption from './BooleanConfigOption';
import ConfigOption from './Private/ConfigOption';
import StringSelectionOption from './StringSelectionConfigOption';
import type {
  BooleanConfigJSON,
  CommandConfigJSON,
  CommandDataJSON,
  StringSelectionConfigJSON
} from '../types/Configs';

// eslint-disable-next-line import/exports-last
export class CommandOptionData {
  declare private enabled: BooleanConfigJSON;
  declare private requiredRole: StringSelectionConfigJSON;

  setDefault(): this {
    return this.setEnabled(new BooleanOption(true)).setRequiredRole(new StringSelectionOption('', ['prefill_roles']));
  }

  setEnabled(value: BooleanOption): this {
    this.enabled = value.toJSON();
    return this;
  }

  setRequiredRole(value: StringSelectionOption): this {
    this.requiredRole = value.toJSON();
    return this;
  }

  toJSON(): CommandDataJSON {
    return { enabled: this.enabled, requiredRole: this.requiredRole };
  }
}

class CommandOption extends ConfigOption<CommandDataJSON> {
  constructor(defaultValue: CommandDataJSON, value: CommandDataJSON = defaultValue) {
    super('command', defaultValue, value);
  }

  isEnabled(): boolean {
    return this.getValue().enabled.value;
  }

  hasPerms(roles: string[]): boolean {
    if (this.getValue().requiredRole.value === '') return true;
    return roles.includes(this.getValue().requiredRole.value);
  }

  toJSON(): CommandConfigJSON {
    return { ...super.toJSON() };
  }
}

export default CommandOption;
