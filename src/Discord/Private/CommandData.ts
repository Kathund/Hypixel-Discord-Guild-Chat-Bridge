import HypixelDiscordGuildBridgeError from '../../Private/Error.js';
import Translate from '../../Private/Translate.js';
import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
  SlashCommandStringOption
} from 'discord.js';

class CommandData extends SlashCommandBuilder {
  private commandGroups: string[];
  constructor() {
    super();
    this.setContexts(InteractionContextType.Guild);
    this.setIntegrationTypes(ApplicationIntegrationType.GuildInstall);
    this.commandGroups = [];
  }

  override setName(name: string): this {
    super.setName(Translate(`discord.commands.${name}`));
    super.setDescription(Translate(`discord.commands.${name}.description`));
    return this;
  }

  override setDescription(description: string): this {
    throw new HypixelDiscordGuildBridgeError(Translate('discord.commands.error.setDescription'));
  }

  override addStringOption(option: SlashCommandStringOption): this {
    option.setName(Translate(`discord.commands.${this.name}.options.${option.name}`));
    option.setDescription(Translate(`discord.commands.${this.name}.options.${option.name}.description`));
    super.addStringOption(option);
    return this;
  }

  addGroup(...groups: string[]): this {
    groups.forEach((group) => {
      if (!this.commandGroups.includes(group)) this.commandGroups.push(group);
    });
    return this;
  }

  getGroups(): string[] {
    return this.commandGroups;
  }
}

export default CommandData;
