import HypixelDiscordGuildBridgeError from '../../Private/Error';
import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate, { unTranslate } from '../../Private/Translate';
import { ChatInputCommandInteraction, Collection, MessageFlags, REST, Routes, Team } from 'discord.js';
import { ErrorEmbed } from '../Private/Embed';
import { SubConfigConfigJSON } from '../../Types/Configs';
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
    if (!command || !interaction.guild) return;
    try {
      await interaction.deferReply();
      console.discord(
        ReplaceVariables(Translate('discord.commands.execute'), {
          username: interaction.user.username,
          userId: interaction.user.id,
          commandName: interaction.commandName
        })
      );

      const untranslatedName = unTranslate(interaction.commandName);
      if (untranslatedName.includes('|')) {
        throw new Error(
          ReplaceVariables(Translate('discord.commands.missing.translate'), { commandName: interaction.commandName })
        );
      }

      const commandConfig = this.discord.Application.config.discord.getValue('commands');
      if (commandConfig === undefined || !commandConfig.isSubConfigConfig()) return;
      const commandConfigOption = commandConfig?.isSubConfigConfig()
        ? (commandConfig.getValue()?.[Translate(untranslatedName, 'en_us')] as SubConfigConfigJSON)
        : undefined;
      if (!commandConfigOption?.value) {
        throw new Error(
          ReplaceVariables(Translate('discord.commands.config.missing'), { commandName: interaction.commandName })
        );
      }
      if (commandConfigOption.value.enabled?.value !== true) {
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('discord.commands.config.disabled'), { commandName: interaction.commandName })
        );
      }
      const member = await interaction.guild.members.fetch(interaction.user.id);
      const memberRoles = member.roles.cache.map((role) => role.id);
      const requiredRole = (commandConfigOption.value.required_role.value as string) || '';
      const aloudUsers = (commandConfig.getValue().aloud_users.value as string[]) || [];
      if (!this.hasPerms(memberRoles, requiredRole, interaction.user.id, aloudUsers)) {
        throw new HypixelDiscordGuildBridgeError(
          ReplaceVariables(Translate('discord.commands.config.missing.perms'), { commandName: interaction.commandName })
        );
      }
      if (command.data.getGroups().includes('minecraft')) {
        if (!this.discord.Application.minecraft.isBotOnline()) {
          throw new HypixelDiscordGuildBridgeError(Translate('minecraft.error.botOffline'));
        }
        this.discord.minecraftCommandData = { name: Translate(unTranslate(command.data.name), 'en_us'), interaction };
        setTimeout(() => {
          this.discord.minecraftCommandData = undefined;
        }, 5000);
      }
      await command.execute(interaction);
    } catch (error) {
      if (error instanceof Error || error instanceof HypixelDiscordGuildBridgeError) {
        this.handleError(interaction, error);
      }
    }
  }

  async deployCommands(): Promise<void> {
    if (!this.discord.isDiscordOnline()) return;
    const commandConfig = this.discord.Application.config.discord.getValue('commands');
    if (!commandConfig || !commandConfig.isSubConfigConfig()) return;
    this.discord.client.commands = new Collection<string, Command>();

    const commandFiles = readdirSync('./src/Discord/Commands');
    const commands = [];
    for (const file of commandFiles) {
      const command = new (await import(`../Commands/${file}`)).default(this.discord);
      if (!command.data.name) continue;
      const untranslatedName = unTranslate(command.data.name);
      if (untranslatedName.includes('|')) continue;
      const commandConfigOption = commandConfig.getValue()?.[Translate(untranslatedName, 'en_us')] as
        | SubConfigConfigJSON
        | undefined;
      if (!commandConfigOption?.value?.enabled?.value) continue;
      commands.push(command.data.toJSON());
      this.discord.client.commands.set(command.data.name, command);
    }

    const clientId = Buffer.from(process.env.DISCORD_TOKEN.split('.')[0], 'base64').toString('ascii');
    await new REST({ version: '10' })
      .setToken(process.env.DISCORD_TOKEN)
      .put(Routes.applicationGuildCommands(clientId, process.env.SERVER_ID), { body: commands });
    console.discord(ReplaceVariables(Translate('discord.commands.ready'), { amount: commands.length }));
  }

  hasPerms(roles: string[], required: string, user: string, users: string[]): boolean {
    return required === '' || users.includes(user) || roles.includes(required);
  }

  async handleError(interaction: ChatInputCommandInteraction, error: Error | HypixelDiscordGuildBridgeError) {
    console.error(error);
    const embed = new ErrorEmbed();
    if (error instanceof HypixelDiscordGuildBridgeError) embed.setDescription(error.message);
    if (!(error instanceof HypixelDiscordGuildBridgeError) && error instanceof Error) {
      if (!this.discord.client || !this.discord.client.application) return;
      const discordApplication = await this.discord.client.application.fetch();
      const logChannelId = this.discord.Application.config.discord.getValue('logging_channel')?.getValue();
      if (typeof logChannelId !== 'string') return;
      const channel = await this.discord.client.channels.fetch(logChannelId);
      if (!channel?.isSendable()) return;
      channel.send({
        content:
          discordApplication.owner instanceof Team
            ? discordApplication.owner.members.map((member) => `<@${member.id}>`).join(' ')
            : `<@${discordApplication.owner?.id}>`,
        embeds: [
          new ErrorEmbed().setDescription(
            ReplaceVariables(Translate('discord.embed.error.description'), {
              message: error.toString(),
              stack: error.stack?.replace(error.toString(), '')
            })
          )
        ]
      });
    }

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}

export default CommandHandler;
