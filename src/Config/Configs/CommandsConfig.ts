import ConfigInstance from '../Private/ConfigInstance';
import type { CommandConfigData } from '../../types/main';

class CommandsConfig extends ConfigInstance<CommandConfigData> {
  constructor(update: boolean = false) {
    super('commands', update);
    this.updateData();
    this.setValue('uptime', { enabled: true });
    this.setValue('restart', { enabled: true });
  }

  isEnabled(command: string): boolean {
    const commandData = this.getValue(command);
    if (commandData === undefined) return false;
    return commandData.enabled;
  }
}

export default CommandsConfig;
