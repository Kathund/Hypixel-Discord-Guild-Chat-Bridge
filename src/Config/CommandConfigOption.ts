import ConfigOption from './Private/ConfigOption';
import type { CommandConfigJSON, CommandDataJSON } from '../types/Configs';

// eslint-disable-next-line import/exports-last
export class CommandOptionData {
  declare private enabled: boolean;

  setEnabled(value: boolean): this {
    this.enabled = value;
    return this;
  }

  toJSON(): CommandDataJSON {
    return { enabled: this.enabled };
  }
}

class CommandOption extends ConfigOption<CommandDataJSON> {
  constructor(defaultValue: CommandDataJSON, value: CommandDataJSON = defaultValue) {
    super('command', defaultValue, value);
  }

  setEnabled(value: boolean): this {
    this.setValue(new CommandOptionData().setEnabled(value).toJSON());
    return this;
  }

  isEnabled(): boolean {
    return this.getValue().enabled;
  }

  toJSON(): CommandConfigJSON {
    return { ...super.toJSON() };
  }
}

export default CommandOption;
