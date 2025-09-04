import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import Embed from '../Private/Embed';
import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import type DiscordManager from '../DiscordManager';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { Devs } from '../../types/main';

class CreditsCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('credits');
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const devs = this.discord.Application.data.getDevs();
    const embed = new Embed().setTitle(Translate('discord.commands.credits.execute.title')).setDescription(
      ReplaceVariables(Translate('discord.commands.credits.execute.description'), {
        developersTitle: Translate('discord.commands.credits.execute.developers.title'),
        developersContent: ReplaceVariables(Translate('discord.commands.credits.execute.developers.content'), {
          devs: Object.keys(devs)
            .map((dev: string) => {
              const devInfo = devs[dev as Devs];
              return ReplaceVariables(Translate('discord.commands.credits.execute.developers.user'), {
                username: devInfo.username,
                id: devInfo.id,
                type: devInfo.types
                  .map((type) => Translate(`discord.commands.credits.execute.developers.${type}`))
                  .join(', ')
              });
            })
            .join('\n')
        }),
        inspirationTitle: Translate('discord.commands.credits.execute.inspiration.title'),
        inspirationContent: Translate('discord.commands.credits.execute.inspiration.content')
      })
    );
    await interaction.followUp({ embeds: [embed] });
  }
}

export default CreditsCommand;
