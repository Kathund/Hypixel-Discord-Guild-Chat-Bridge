import Embed from '../Discord/Private/Embed';
import MessageHandler from './Handlers/MessageHandler';
import NumberOption from '../Config/Options/Number';
import StateHandler from './Handlers/StateHandler';
import StringOption from '../Config/Options/String';
import { Bot, createBot } from 'mineflayer';
import { CleanMessageForDiscord } from '../Utils/StringUtils';
import type Application from '../Application';
import type { EmbedData } from '../types/main';
import type { MessageCreateOptions } from 'discord.js';

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

  isBotOnline(): this is this & { bot: Bot } {
    // eslint-disable-next-line no-underscore-dangle
    return this.bot?._client?.chat !== undefined;
  }

  sendToDiscordEmbed(embedData: EmbedData, channelId: string) {
    // eslint-disable-next-line hypixelDiscordGuildChatBridge/enforce-translate
    const embed = new Embed().clearEmbed().setDescription(embedData.message);
    if (embedData.title) embed.setAuthor({ name: embedData.title });
    if (embedData.username && embed.data.author) {
      embed.setAuthor({ name: embed.data.author.name, iconURL: `https://mc-heads.net/avatar/${embedData.username}` });
    }
    if (embedData.color) embed.setColorFromDefault(embedData.color);

    this.sendToDiscord({ embeds: [embed] }, channelId);
  }

  sendToDiscordMessage(message: string, channelId: string) {
    this.sendToDiscord({ content: message }, channelId);
  }

  private async sendToDiscord(messageData: MessageCreateOptions, channelId: string) {
    if (!this.Application.discord.isDiscordOnline()) return;
    const channel = await this.Application.discord.client.channels.fetch(channelId);
    if (messageData.content) {
      messageData.content = CleanMessageForDiscord(messageData.content.replace(/\s{2,}/g, ' ').trim());
    }
    messageData.allowedMentions = { parse: [] };
    if (channel?.isSendable()) channel.send(messageData);
  }
}

export default MinecraftManager;
