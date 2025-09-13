import ArrayOption from '../Options/Array.js';
import BaseConfigInstance from '../Private/BaseConfigInstance.js';
import BooleanOption from '../Options/Boolean.js';
import ConfigInstance from '../Private/ConfigInstance.js';
import InternalOption from '../Options/Internal.js';
import StringOption from '../Options/String.js';
import StringSelectionOption from '../Options/StringSelection.js';
import SubConfigOption from '../Options/SubConfig.js';

const discordCommandConfig = new SubConfigOption(
  new BaseConfigInstance()
    .setValue('enabled', new BooleanOption(true), false)
    .setValue('required_role', new StringSelectionOption('', ['prefill_roles']), false)
    .toJSON()
);

class DiscordConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('discord', update);
    this.updateData();
    this.setValue('guild_channel', new StringSelectionOption('', ['prefill_channels']), false);
    this.setValue('officer_channel', new StringSelectionOption('', ['prefill_channels']), false);
    this.setValue('logging_channel', new StringSelectionOption('', ['prefill_channels']), false);
    this.setValue('message_format', new StringOption('{chatType} > {rank} {username} {guildRank}: {message}'), false);
    this.setValue(
      'commands',
      new SubConfigOption(
        new BaseConfigInstance()
          .setValue('credits', discordCommandConfig, false)
          .setValue('demote', discordCommandConfig, false)
          .setValue('invite', discordCommandConfig, false)
          .setValue('kick', discordCommandConfig, false)
          .setValue('mute', discordCommandConfig, false)
          .setValue('online', discordCommandConfig, false)
          .setValue('promote', discordCommandConfig, false)
          .setValue('restart', discordCommandConfig, false)
          .setValue('unmute', discordCommandConfig, false)
          .setValue('uptime', discordCommandConfig, false)
          .setValue(
            'internal_button_reload_commands_discord',
            new InternalOption('internal_button_reload_commands_discord'),
            false
          )
          .setValue('aloud_users', new ArrayOption<string>(['1276524855445164098']), false)
          .toJSON()
      ),
      false
    );
  }
}

export default DiscordConfig;
