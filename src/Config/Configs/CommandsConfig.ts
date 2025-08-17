import CommandOption, { CommandOptionData } from '../CommandConfigOption';
import ConfigInstance from '../Private/ConfigInstance';

class CommandsConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('commands', update);
    this.updateData();
    this.setValue('restart', new CommandOption(new CommandOptionData().setDefault().toJSON()), false);
    this.setValue('uptime', new CommandOption(new CommandOptionData().setDefault().toJSON()), false);
  }
}

export default CommandsConfig;
