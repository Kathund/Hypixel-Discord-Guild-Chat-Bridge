import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import type MinecraftManager from '../MinecraftManager';

class StateHandler {
  declare readonly minecraft: MinecraftManager;
  declare loginAttempts: number;
  constructor(minecraftManager: MinecraftManager) {
    this.minecraft = minecraftManager;
    this.loginAttempts = 0;
  }

  registerEvents() {
    if (!this.minecraft.isBotOnline()) return;
    this.minecraft.bot.on('login', (...args) => this.onLogin(...args));
    this.minecraft.bot.on('end', (...args) => this.onEnd(...args));
    this.minecraft.bot.on('kicked', (...args) => this.onKicked(...args));
    this.minecraft.bot.on('error', (...args) => this.onError(...args));
  }

  onLogin() {
    if (!this.minecraft.isBotOnline()) return;
    console.minecraft(ReplaceVariables(Translate('minecraft.state.ready'), { username: this.minecraft.bot.username }));
    this.loginAttempts = 0;
  }

  onEnd(reason: string) {
    if (reason && reason === 'Shutting Down') return;
    const loginDelay = (this.loginAttempts + 1) * 5000;
    console.warn(ReplaceVariables(Translate('minecraft.state.end'), { seconds: loginDelay / 1000 }));
    setTimeout(() => this.minecraft.connect(), loginDelay);
  }

  onKicked(reason: string, loggedIn: boolean) {
    console.warn(ReplaceVariables(Translate('minecraft.state.kick'), { reason }));
    this.loginAttempts++;
  }

  onError(error: Error) {
    console.error(error);
  }
}

export default StateHandler;
