import HypixelDiscordGuildBridgeError from '../../Private/Error';
import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import { ChatInputCommandInteraction, Collection, REST, Routes } from 'discord.js';
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
    try {
      await interaction.deferReply();
      console.discord(
        ReplaceVariables(Translate('discord.commands.execute'), {
          username: interaction.user.username,
          userId: interaction.user.id,
          commandName: interaction.commandName
        })
      );
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof HypixelDiscordGuildBridgeError) {
        this.discord.utils.handleError(interaction, error);
      }
    }
  }

  async deployCommands(): Promise<void> {
    if (!this.discord.client) return;
    this.discord.client.commands = new Collection<string, Command>();

    const commandFiles = readdirSync('./src/Discord/Commands');
    const commands = [];
    for (const file of commandFiles) {
      const command = new (await import(`../Commands/${file}`)).default(this.discord);
      if (command.data.name) {
        if (
          command.data.name !== 'credits' &&
          this.discord.Application.config.commands.isEnabled(command.data.name) !== true
        ) {
          continue;
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
}

export default CommandHandler;
