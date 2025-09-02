import HypixelDiscordGuildBridgeError from '../../Private/Error';
import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import { ChatInputCommandInteraction, Collection, REST, Routes } from 'discord.js';
import { SubConfigConfigJSON } from '../../types/Configs';
import { readdirSync } from 'node:fs';
import type Command from '../Private/Command';
import type DiscordManager from '../DiscordManager';

class CommandHandler {
  readonly discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async onCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    if (!interaction.guild) return;
    try {
      await interaction.deferReply();
      console.discord(
        ReplaceVariables(Translate('discord.commands.execute'), {
          username: interaction.user.username,
          userId: interaction.user.id,
          commandName: interaction.commandName
        })
      );

      const commandConfig = this.discord.Application.config.discord.getValue('commands');
      if (
        commandConfig === undefined ||
        !commandConfig.isSubConfigConfig() ||
        commandConfig.getValue() === undefined ||
        commandConfig.getValue()[interaction.commandName] === undefined ||
        commandConfig.getValue()[interaction.commandName].value === undefined
      ) {
        throw new Error(
          ReplaceVariables(Translate('discord.commands.config.missing'), { commandName: interaction.commandName })
        );
      }
      const commandConfigOption = commandConfig.getValue()[interaction.commandName] as SubConfigConfigJSON;
      if (
        commandConfigOption === undefined ||
        commandConfigOption.value === undefined ||
        commandConfigOption.value === null ||
        commandConfigOption.value.enabled === undefined
      ) {
        throw new Error(
          ReplaceVariables(Translate('discord.commands.config.missing'), { commandName: interaction.commandName })
        );
      }
      if (commandConfigOption.value.enabled.value !== true) {
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('discord.commands.config.disabled'), { commandName: interaction.commandName })
        );
      }
      const member = await interaction.guild.members.fetch(interaction.user.id);
      if (
        this.hasPerms(
          member.roles.cache.map((role) => role.id),
          (commandConfigOption.value.required_role.value as string) || '',
          interaction.user.id,
          (commandConfig.getValue().aloud_users.value as string[]) || []
        ) === false
      ) {
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('discord.commands.config.missing.perms'), { commandName: interaction.commandName })
        );
      }
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof HypixelDiscordGuildBridgeError) {
        this.discord.utils.handleError(interaction, error);
      }
    }
  }

  async deployCommands(): Promise<void> {
    if (!this.discord.client) return;
    const commandConfig = this.discord.Application.config.discord.getValue('commands');
    this.discord.client.commands = new Collection<string, Command>();

    const commandFiles = readdirSync('./src/Discord/Commands');
    const commands = [];
    for (const file of commandFiles) {
      const command = new (await import(`../Commands/${file}`)).default(this.discord);
      if (command.data.name) {
        if (command.data.name !== 'credits') {
          if (commandConfig === undefined) continue;
          if (!commandConfig.isSubConfigConfig()) continue;
          if (commandConfig.getValue() === undefined) continue;
          if (commandConfig.getValue()[command.data.name] === undefined) continue;
          if (commandConfig.getValue()[command.data.name].value === undefined) continue;
          const commandConfigOption = commandConfig.getValue()[command.data.name] as SubConfigConfigJSON;
          if (commandConfigOption === undefined) continue;
          if (commandConfigOption.value === undefined) continue;
          if (commandConfigOption.value === null) continue;
          if (commandConfigOption.value.enabled === undefined) continue;
          if (commandConfigOption.value.enabled.value !== true) continue;
        }
        commands.push(command.data.toJSON());
        this.discord.client.commands.set(command.data.name, command);
      }
    }

    const clientId = Buffer.from(process.env.DISCORD_TOKEN.split('.')[0], 'base64').toString('ascii');
    await new REST({ version: '10' })
      .setToken(process.env.DISCORD_TOKEN)
      .put(Routes.applicationGuildCommands(clientId, process.env.SERVER_ID), { body: commands });
    console.discord(ReplaceVariables(Translate('discord.commands.ready'), { amount: commands.length }));
  }

  hasPerms(roles: string[], required: string, user: string, users: string[]): boolean {
    if (required === '') return true;
    if (users.includes(user)) return true;
    return roles.includes(required);
  }
}

export default CommandHandler;
