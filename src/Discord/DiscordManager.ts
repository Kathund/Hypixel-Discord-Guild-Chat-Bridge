import CommandHandler from './Handlers/CommandHandler.js';
import InteractionHandler from './Handlers/InteractionHandler.js';
import MessageHandler from './Handlers/MessageHandler.js';
import ScriptHandler from './Handlers/ScriptHandler.js';
import StateHandler from './Handlers/StateHandler.js';
import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits } from 'discord.js';
import type Application from '../Application.js';

class DiscordManager {
  readonly Application: Application;
  private readonly interactionHandler: InteractionHandler;
  private readonly stateHandler: StateHandler;
  readonly commandHandler: CommandHandler;
  private readonly messageHandler: MessageHandler;
  readonly scriptHandler: ScriptHandler;
  client?: Client;
  minecraftCommandData?: { name: string; interaction: ChatInputCommandInteraction };
  constructor(app: Application) {
    this.Application = app;
    this.commandHandler = new CommandHandler(this);
    this.interactionHandler = new InteractionHandler(this);
    this.stateHandler = new StateHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.scriptHandler = new ScriptHandler(this);
    this.minecraftCommandData = undefined;
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

  isDiscordOnline(): this is this & { client: Client } {
    return this.client?.isReady() !== undefined;
  }
}

export default DiscordManager;
