import CommandHandler from './Handlers/CommandHandler';
import DiscordUtils from './Private/DiscordUtils';
import InteractionHandler from './Handlers/InteractionHandler';
import StateHandler from './Handlers/StateHandler';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import type Application from '../Application';

class DiscordManager {
  readonly Application: Application;
  declare interactionHandler: InteractionHandler;
  declare stateHandler: StateHandler;
  declare commandHandler: CommandHandler;
  declare utils: DiscordUtils;
  client?: Client;
  constructor(app: Application) {
    this.Application = app;
    this.commandHandler = new CommandHandler(this);
    this.interactionHandler = new InteractionHandler(this);
    this.stateHandler = new StateHandler(this);
    this.utils = new DiscordUtils(this);
  }

  connect(): void {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.commandHandler.deployCommands();
    this.client.on(Events.ClientReady, () => this.stateHandler.onReady());
    this.client.on(Events.InteractionCreate, (interaction) => this.interactionHandler.onInteraction(interaction));
    this.client.login(process.env.DISCORD_TOKEN).catch((e) => console.error(e));
  }
}

export default DiscordManager;
