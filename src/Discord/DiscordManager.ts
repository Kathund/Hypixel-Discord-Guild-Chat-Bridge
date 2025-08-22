import CommandHandler from './Handlers/CommandHandler';
import DiscordUtils from './Private/DiscordUtils';
import InteractionHandler from './Handlers/InteractionHandler';
import MessageHandler from './Handlers/MessageHandler';
import StateHandler from './Handlers/StateHandler';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import type Application from '../Application';

class DiscordManager {
  readonly Application: Application;
  declare interactionHandler: InteractionHandler;
  declare stateHandler: StateHandler;
  declare commandHandler: CommandHandler;
  declare messageHandler: MessageHandler;
  declare utils: DiscordUtils;
  client?: Client;
  constructor(app: Application) {
    this.Application = app;
    this.commandHandler = new CommandHandler(this);
    this.interactionHandler = new InteractionHandler(this);
    this.stateHandler = new StateHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.utils = new DiscordUtils(this);
  }

  connect(): void {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
      ]
    });
    this.commandHandler.deployCommands();
    this.client.on(Events.ClientReady, () => this.stateHandler.onReady());
    this.client.on(Events.InteractionCreate, (interaction) => this.interactionHandler.onInteraction(interaction));
    this.client.on(Events.MessageCreate, (message) => this.messageHandler.onMessage(message));
    this.client.login(process.env.DISCORD_TOKEN).catch((e) => console.error(e));
  }
}

export default DiscordManager;
