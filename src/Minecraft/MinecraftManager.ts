import MessageHandler from './Handlers/MessageHandler';
import NumberOption from '../Config/Options/Number';
import StateHandler from './Handlers/StateHandler';
import StringOption from '../Config/Options/String';
import { Bot, createBot } from 'mineflayer';
import type Application from '../Application';

class MinecraftManager {
  declare readonly Application: Application;
  declare readonly messageHandler: MessageHandler;
  declare readonly stateHandler: StateHandler;
  declare bot?: Bot;
  constructor(app: Application) {
    this.Application = app;
    this.messageHandler = new MessageHandler(this);
    this.stateHandler = new StateHandler(this);
  }

  connect() {
    this.bot = createBot({
      username: 'test',
      host: (
        this.Application.config.minecraft.getValue('server') || new StringOption('mc.hypixel.net')
      ).getValue() as string,
      port: (this.Application.config.minecraft.getValue('port') || new NumberOption(25565)).getValue() as number,
      auth: 'microsoft',
      version: (
        this.Application.config.minecraft.getValue('version') || new StringOption('1.8.9')
      ).getValue() as string,
      viewDistance: 'tiny',
      chatLengthLimit: (
        this.Application.config.minecraft.getValue('max_chat_length') || new NumberOption(256)
      ).getValue() as number,
      profilesFolder: './minecraft-auth-cache'
    });

    this.messageHandler.registerEvents();
    this.stateHandler.registerEvents();
  }

  isBotOnline() {
    // eslint-disable-next-line no-underscore-dangle
    return this.bot?._client?.chat !== undefined;
  }
}

export default MinecraftManager;
