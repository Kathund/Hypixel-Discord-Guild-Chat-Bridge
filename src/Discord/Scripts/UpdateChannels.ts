import BaseConfigInstance from '../../Config/Private/BaseConfigInstance.js';
import Script from '../Private/Script.js';
import ScriptData from '../Private/ScriptData.js';
import Translate from '../../Private/Translate.js';
import UpdateChannelsCommand from '../Commands/UpdateChannels.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type DiscordManager from '../DiscordManager.js';
import type { SubConfigConfigJSON } from '../../Types/Configs.js';

class UpdateChannelsScript extends Script {
  constructor(discord: DiscordManager) {
    super(discord);
    this.data = new ScriptData().setName('update_channels');
  }

  override async execute(): Promise<void> {
    console.discord(Translate('discord.scripts.update_channels.run'));
    if (!this.discord.Application.minecraft.isBotOnline()) {
      throw new Error(Translate('minecraft.error.bot.offline'));
    }
    if (!this.discord.isDiscordOnline()) {
      throw new Error(Translate('discord.commands.update_channels.execute.error.discord.offline'));
    }
    const commandConfig = this.discord.Application.config.discord.getValue('commands');
    if (!commandConfig || !commandConfig.isSubConfigConfig()) {
      throw new Error(Translate('discord.commands.update_channels.execute.error.missing.config'));
    }

    const commandConfigOption = commandConfig.getValue()?.['update-channels'] as SubConfigConfigJSON | undefined;
    if (commandConfigOption?.value === undefined) {
      throw new Error(Translate('discord.commands.update_channels.execute.error.missing.config'));
    }
    const configOption = BaseConfigInstance.getConfigOption(commandConfigOption);
    if (configOption === undefined || !configOption.isSubConfigConfig()) {
      throw new Error(Translate('discord.commands.update_channels.execute.error.missing.config'));
    }
    const amount = await UpdateChannelsCommand.updateChannels(
      this.discord.client,
      this.discord.Application.minecraft.bot,
      configOption
    );
    console.discord(ReplaceVariables(Translate('discord.commands.update_channels.execute.success'), { amount }));
  }
}

export default UpdateChannelsScript;
