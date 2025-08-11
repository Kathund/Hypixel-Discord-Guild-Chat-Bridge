import HypixelDiscordGuildBridgeError from '../../Private/Error';
import Translate from '../../Private/Translate';
import { ApplicationIntegrationType, InteractionContextType, SlashCommandBuilder } from 'discord.js';

class CommandData extends SlashCommandBuilder {
  constructor() {
    super();
    this.setContexts(InteractionContextType.Guild);
    this.setIntegrationTypes(ApplicationIntegrationType.GuildInstall);
  }

  setName(name: string): this {
    super.setName(Translate(`discord.commands.${name}`));
    super.setDescription(Translate(`discord.commands.${name}.description`));
    return this;
  }

  setDescription(description: string): this {
    throw new HypixelDiscordGuildBridgeError(Translate('discord.commands.setDescription'));
  }
}

export default CommandData;
