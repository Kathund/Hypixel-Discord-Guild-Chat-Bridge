import Command from '../Private/Command.js';
import CommandData from '../Private/CommandData.js';
import DataManager from '../../Data/DataManager.js';
import Embed from '../Private/Embed.js';
import Translate from '../../Private/Translate.js';
import { DevType, Devs } from '../../Types/Data.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { DiscordManagerWithClient } from '../../Types/Discord.js';

class CreditsCommand extends Command {
  constructor(discord: DiscordManagerWithClient) {
    super(discord);
    this.data = new CommandData().setName('credits');
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
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
