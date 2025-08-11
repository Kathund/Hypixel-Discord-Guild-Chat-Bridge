import type DiscordManager from '../DiscordManager';
import type { BaseInteraction } from 'discord.js';

class InteractionHandler {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  onInteraction(interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) this.discord.commandHandler.onCommand(interaction);
  }
}

export default InteractionHandler;
