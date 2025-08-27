import BaseConfigInstance from '../Private/BaseConfigInstance';
import BooleanOption from '../Options/Boolean';
import ConfigInstance from '../Private/ConfigInstance';
import InternalOption from '../Options/Internal';
import StringOption from '../Options/String';
import StringSelectionOption from '../Options/StringSelection';
import SubConfigOption from '../Options/SubConfig';

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
          .setValue(
            'online',
            new SubConfigOption(
              new BaseConfigInstance()
                .setValue('enabled', new BooleanOption(true), false)
                .setValue('required_role', new StringSelectionOption('', ['prefill_roles']), false)
                .toJSON()
            ),
            false
          )
          .setValue(
            'uptime',
            new SubConfigOption(
              new BaseConfigInstance()
                .setValue('enabled', new BooleanOption(true), false)
                .setValue('required_role', new StringSelectionOption('', ['prefill_roles']), false)
                .toJSON()
            ),
            false
          )
          .setValue(
            'restart',
            new SubConfigOption(
              new BaseConfigInstance()
                .setValue('enabled', new BooleanOption(true), false)
                .setValue('required_role', new StringSelectionOption('', ['prefill_roles']), false)
                .toJSON()
            ),
            false
          )
          .setValue('internal_button_reload_commands', new InternalOption('internal_button_reload_commands'), false)
          .toJSON()
      ),
      false
    );
  }
}

export default DiscordConfig;
