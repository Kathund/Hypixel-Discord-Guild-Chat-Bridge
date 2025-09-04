import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import { ActivityType } from 'discord.js';
import type DiscordManager from '../DiscordManager';

class StateHandler {
  readonly discord: DiscordManager;
  constructor(discordManager: DiscordManager) {
    this.discord = discordManager;
  }

  onReady() {
    if (!this.discord.client || !this.discord.client.user) return;
    console.discord(
      ReplaceVariables(Translate('discord.state.ready'), {
        username: this.discord.client.user?.username,
        id: this.discord.client.user?.id
      })
    );
    this.discord.client.user.setActivity({ name: Translate('discord.state.activity'), type: ActivityType.Playing });
  }
}

export default StateHandler;
