import HypixelDiscordGuildBridgeError from '../../Private/Error';
import Translate from '../../Private/Translate';
import { ChatInputCommandInteraction, MessageFlags, Team } from 'discord.js';
import { ErrorEmbed } from './Embed';
import type DiscordManager from '../DiscordManager';

class DiscordUtils {
  declare discord: DiscordManager;
  constructor(discord: DiscordManager) {
    this.discord = discord;
  }

  async handleError(interaction: ChatInputCommandInteraction, error: Error | HypixelDiscordGuildBridgeError) {
    console.error(error);
    const embed = new ErrorEmbed();
    if (error instanceof HypixelDiscordGuildBridgeError) embed.setDescription(error.message);
    if (!(error instanceof HypixelDiscordGuildBridgeError) && error instanceof Error) {
      if (!this.discord.client || !this.discord.client.application) return;
      const app = await this.discord.client.application.fetch();
      const channel = await this.discord.client.channels.fetch('1382234788953460746');
      if (channel?.isSendable()) {
        channel.send({
          content:
            app.owner instanceof Team === true
              ? app.owner.members.map((member) => `<@${member.id}>`).join(' ')
              : `<@${app.owner?.id}>`,
          embeds: [new ErrorEmbed().setDescription(Translate('embed.error.description'))]
        });
      }
    }
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}

export default DiscordUtils;
