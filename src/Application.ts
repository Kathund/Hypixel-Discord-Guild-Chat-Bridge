import ConfigManager from './Config/ConfigManager';
import DiscordManager from './Discord/DiscordManager';

class Application {
  declare config: ConfigManager;
  declare discord: DiscordManager;
  constructor() {
    this.config = new ConfigManager(this);
    this.discord = new DiscordManager(this);
  }

  connect(): void {
    this.discord.connect();
  }
}

export default Application;
