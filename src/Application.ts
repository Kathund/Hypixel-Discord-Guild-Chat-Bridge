import ConfigManager from './Config/ConfigManager.js';
import DiscordManager from './Discord/DiscordManager.js';
import MinecraftManager from './Minecraft/MinecraftManager.js';
import WebManager from './Web/WebManager.js';

class Application {
  readonly config: ConfigManager;
  readonly discord: DiscordManager;
  readonly minecraft: MinecraftManager;
  readonly web: WebManager;
  constructor() {
    this.config = new ConfigManager();
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.web = new WebManager(this);
  }

  connect(): void {
    this.discord.connect();
    this.minecraft.connect();
    this.web.connect();
  }

  async stop(): Promise<void> {
    if (this.discord.isDiscordOnline()) await this.discord.client.destroy();
    if (this.minecraft.isBotOnline()) this.minecraft.bot.end('Shutting Down');
    this.web.disconnect();
  }
}

export default Application;
