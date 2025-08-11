import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import type DiscordManager from '../DiscordManager';

class StateHandler {
  readonly discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  onReady() {
    if (!this.discord.client || !this.discord.client.user) return;
    console.discord(
      ReplaceVariables(Translate('state.discord.ready'), {
        username: this.discord.client.user?.username,
        id: this.discord.client.user?.id
      })
    );
  }
}

export default StateHandler;
