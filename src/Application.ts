import ConfigManager from './Config/ConfigManager';
import DiscordManager from './Discord/DiscordManager';
import MinecraftManager from './Minecraft/MinecraftManager';
import WebManager from './Web/WebManager';

class Application {
  declare config: ConfigManager;
  declare discord: DiscordManager;
  declare minecraft: MinecraftManager;
  declare web: WebManager;
  constructor() {
    this.config = new ConfigManager(this);
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.web = new WebManager(this);
  }

  connect(): void {
    this.discord.connect();
    this.minecraft.connect();
    this.web.loadServer();
  }

  async stop(): Promise<void> {
    if (this.discord.client) await this.discord.client.destroy();
    if (this.minecraft.bot) this.minecraft.bot.end('Shutting Down');
    this.web.stopServer();
  }
}

export default Application;
