import ArrayOption from '../Options/Array.js';
import BaseConfigInstance from '../Private/BaseConfigInstance.js';
import BooleanOption from '../Options/Boolean.js';
import ConfigInstance from '../Private/ConfigInstance.js';
import InternalOption from '../Options/Internal.js';
import NumberOption from '../Options/Number.js';
import StringOption from '../Options/String.js';
import StringSelectionOption from '../Options/StringSelection.js';
import SubConfigOption from '../Options/SubConfig.js';

const discordCommandConfig = new SubConfigOption(
  new BaseConfigInstance()
    .setValue('enabled', new BooleanOption(true), false)
    .setValue('required_role', new StringSelectionOption('', ['prefill_roles']), false)
    .toJSON()
);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const scriptConfig = new SubConfigOption(
  new BaseConfigInstance()
    .setValue('enabled', new BooleanOption(true), false)
    .setValue('refresh', new NumberOption(5), false)
    .toJSON()
);
const discordStatsChannelsConfig = new SubConfigOption(
  new BaseConfigInstance()
    .setValue('enabled', new BooleanOption(false), false)
    .setValue('format', new StringOption('Guild Level: {guild_level}'), false)
    .setValue('channel', new StringSelectionOption('', ['prefill_channels']), false)
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
          .setValue(
            'update-channels',
            new SubConfigOption(
              new BaseConfigInstance()
                .setValue('enabled', new BooleanOption(true), false)
                .setValue('required_role', new StringSelectionOption('', ['prefill_roles']), false)
                .setValue('slot1', discordStatsChannelsConfig, false)
                .setValue('slot2', discordStatsChannelsConfig, false)
                .setValue('slot3', discordStatsChannelsConfig, false)
                .setValue('slot4', discordStatsChannelsConfig, false)
                .setValue('slot5', discordStatsChannelsConfig, false)
                .setValue(
                  'options',
                  new SubConfigOption(
                    new BaseConfigInstance()
                      .setValue('boolean', new BooleanOption(true), false)
                      .setValue('internal_string_guild_name', new InternalOption('internal_string_guild_name'), false)
                      .setValue(
                        'internal_string_guild_online',
                        new InternalOption('internal_string_guild_online'),
                        false
                      )
                      .setValue('internal_string_guild_level', new InternalOption('internal_string_guild_level'), false)
                      .setValue(
                        'internal_string_guild_level_with_progress',
                        new InternalOption('internal_string_guild_level_with_progress'),
                        false
                      )
                      .setValue('internal_string_guild_xp', new InternalOption('internal_string_guild_xp'), false)
                      .setValue(
                        'internal_string_guild_weekly_xp',
                        new InternalOption('internal_string_guild_weekly_xp'),
                        false
                      )
                      .setValue(
                        'internal_string_guild_members',
                        new InternalOption('internal_string_guild_members'),
                        false
                      )
                      .setValue(
                        'internal_string_discord_members',
                        new InternalOption('internal_string_discord_members'),
                        false
                      )
                      .setValue(
                        'internal_string_discord_channels',
                        new InternalOption('internal_string_discord_channels'),
                        false
                      )
                      .setValue(
                        'internal_string_discord_roles',
                        new InternalOption('internal_string_discord_roles'),
                        false
                      )
                      .toJSON()
                  ),
                  false
                )
                .toJSON()
            ),
            false
          )
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
    this.setValue(
      'scripts',
      new SubConfigOption(
        new BaseConfigInstance()
          .setValue(
            'update_channels',
            new SubConfigOption(
              new BaseConfigInstance()
                .setValue('enabled', new BooleanOption(true), false)
                .setValue('refresh', new NumberOption(5), false)
                .setValue(
                  'internal_button_go_to_config_discord_commands_update-channels',
                  new InternalOption('internal_button_go_to_config_discord_commands_update-channels'),
                  false
                )
                .toJSON()
            ),
            false
          )
          .toJSON()
      ),
      false
    );
  }
}

export default DiscordConfig;
