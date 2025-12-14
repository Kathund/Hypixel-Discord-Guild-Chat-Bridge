import Translate from '../../Private/Translate.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type MinecraftManager from '../MinecraftManager.js';
import type { SubConfigConfigJSON } from '../../Types/Configs.js';

class StateHandler {
  private readonly minecraft: MinecraftManager;
  private loginAttempts: number;
  constructor(minecraftManager: MinecraftManager) {
    this.minecraft = minecraftManager;
    this.loginAttempts = 0;
  }

  registerEvents() {
    if (!this.minecraft.bot) return;
    this.minecraft.bot.on('login', (...args) => this.onLogin(...args));
    this.minecraft.bot.on('end', (...args) => this.onEnd(...args));
    this.minecraft.bot.on('kicked', (...args) => this.onKicked(...args));
    this.minecraft.bot.on('error', (...args) => this.onError(...args));
  }

  onLogin() {
    if (!this.minecraft.isBotOnline()) return;
    const username = this.minecraft.bot.username;
    console.minecraft(ReplaceVariables(Translate('minecraft.state.ready'), { username }));
    this.loginAttempts = 0;

    const eventConfig = this.minecraft.Application.config.minecraft.getValue('events');
    if (eventConfig?.isSubConfigConfig()) {
      const config = eventConfig.getValue();
      if ((config?.bot_login as SubConfigConfigJSON)?.value?.enabled?.value) {
        return this.minecraft.messageHandler
          .getEventsChannels('bot_login')
          .forEach((channel) =>
            this.minecraft.sendToDiscordEmbed(
              {
                message: ReplaceVariables(Translate('minecraft.chat.events.login.bot'), { username }),
                title: Translate('minecraft.chat.events.login.bot.title'),
                username,
                color: 'Green'
              },
              channel
            )
          );
      }
    }
  }

  onEnd(reason: string) {
    if (reason && reason === 'Shutting Down') return;
    const loginDelay = (this.loginAttempts + 1) * 5000;
    console.warn(ReplaceVariables(Translate('minecraft.state.end'), { seconds: loginDelay / 1000 }));
    setTimeout(() => this.minecraft.connect(), loginDelay);

    const username = this.minecraft.bot?.username ?? 'UNKNOWN';
    const eventConfig = this.minecraft.Application.config.minecraft.getValue('events');
    if (eventConfig?.isSubConfigConfig()) {
      const config = eventConfig.getValue();
      if ((config?.bot_login as SubConfigConfigJSON)?.value?.enabled?.value) {
        return this.minecraft.messageHandler
          .getEventsChannels('bot_login')
          .forEach((channel) =>
            this.minecraft.sendToDiscordEmbed(
              {
                message: ReplaceVariables(Translate('minecraft.chat.events.left.bot'), { username, reason }),
                title: Translate('minecraft.chat.events.left.bot.title'),
                username,
                color: 'Red'
              },
              channel
            )
          );
      }
    }
  }

  onKicked(reason: string, loggedIn: boolean) {
    console.warn(ReplaceVariables(Translate('minecraft.state.kick'), { reason }));
    this.loginAttempts++;

    const username = this.minecraft.bot?.username ?? 'UNKNOWN';
    const eventConfig = this.minecraft.Application.config.minecraft.getValue('events');
    if (eventConfig?.isSubConfigConfig()) {
      const config = eventConfig.getValue();
      if ((config?.bot_login as SubConfigConfigJSON)?.value?.enabled?.value) {
        return this.minecraft.messageHandler
          .getEventsChannels('bot_login')
          .forEach((channel) =>
            this.minecraft.sendToDiscordEmbed(
              {
                message: ReplaceVariables(Translate('minecraft.chat.events.left.bot'), { username, reason }),
                title: Translate('minecraft.chat.events.left.bot.title'),
                username,
                color: 'Red'
              },
              channel
            )
          );
      }
    }
  }

  onError(error: Error) {
    console.error(error);
  }
}

export default StateHandler;
