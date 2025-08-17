import ConfigManager from './Config/ConfigManager';
import DiscordManager from './Discord/DiscordManager';
import WebManager from './Web/WebManager';

class Application {
  declare config: ConfigManager;
  declare discord: DiscordManager;
  declare web: WebManager;
  constructor() {
    this.config = new ConfigManager(this);
    this.discord = new DiscordManager(this);
    this.web = new WebManager(this);
  }

  connect(): void {
    this.discord.connect();
  }
}

export default Application;
