import Command from '../Private/Command';
import CommandData from '../Private/CommandData';
import DataManager from '../../Data/DataManager';
import Embed from '../Private/Embed';
import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import { DevType, type Devs } from '../../types/main';
import type DiscordManager from '../DiscordManager';
import type { ChatInputCommandInteraction } from 'discord.js';

class CreditsCommand extends Command {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new CommandData().setName('credits');
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const devs = DataManager.getDevs();
    const embed = new Embed()
      .setTitle(Translate('discord.commands.credits.execute.title'))
      .setFields(
        DevType.options.map((type) => {
          return {
            name: Translate(`discord.commands.credits.execute.developers.${type}`),
            value: Object.keys(devs)
              .filter((dev) => devs[dev as Devs].types.includes(type))
              .map((dev) => {
                const devInfo = devs[dev as Devs];
                return ReplaceVariables(Translate('discord.commands.credits.execute.developers.user'), {
                  username: devInfo.username,
                  id: devInfo.id
                });
              })
              .join('\n')
          };
        })
      )
      .addFields({
        name: Translate('discord.commands.credits.execute.inspiration.title'),
        value: Translate('discord.commands.credits.execute.inspiration.content')
      });
    await interaction.followUp({ embeds: [embed] });
  }
}

export default CreditsCommand;
