import BaseConfigInstance from '../Private/BaseConfigInstance.js';
import BooleanOption from '../Options/Boolean.js';
import ConfigInstance from '../Private/ConfigInstance.js';
import InternalOption from '../Options/Internal.js';
import NumberOption from '../Options/Number.js';
import StringOption from '../Options/String.js';
import SubConfigOption from '../Options/SubConfig.js';

const eventConfig = new SubConfigOption(
  new BaseConfigInstance()
    .setValue('enabled', new BooleanOption(true), false)
    .setValue('guild_channel', new BooleanOption(true), false)
    .setValue('officer_channel', new BooleanOption(false), false)
    .setValue('log_channel', new BooleanOption(false), false)
    .toJSON()
);
const eventLogConfig = new SubConfigOption(
  new BaseConfigInstance()
    .setValue('enabled', new BooleanOption(true), false)
    .setValue('guild_channel', new BooleanOption(true), false)
    .setValue('officer_channel', new BooleanOption(false), false)
    .setValue('log_channel', new BooleanOption(true), false)
    .toJSON()
);
const minecraftCommandConfig = new SubConfigOption(
  new BaseConfigInstance().setValue('enabled', new BooleanOption(true), false).toJSON()
);

class MinecraftConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('minecraft', update);
    this.updateData();
    this.setValue('server', new StringOption('mc.hypixel.net'), false);
    this.setValue('port', new NumberOption(25565, 25565, 65535, 1), false);
    this.setValue('version', new StringOption('1.8.9'), false);
    this.setValue('max_chat_length', new NumberOption(256, 256, 512, 128), false);
    this.setValue('auto_limbo', new BooleanOption(true), false);
    this.setValue('message_format', new StringOption('{username} » {message}'), false);
    this.setValue(
      'events',
      new SubConfigOption(
        new BaseConfigInstance()
          .setValue('member_login', eventConfig, false)
          .setValue('member_logout', eventConfig, false)
          .setValue(
            'guild_member_join',
            new SubConfigOption(
              new BaseConfigInstance()
                .setValue('enabled', new BooleanOption(true), false)
                .setValue('guild_channel', new BooleanOption(true), false)
                .setValue('officer_channel', new BooleanOption(false), false)
                .setValue('log_channel', new BooleanOption(true), false)
                .setValue(
                  'join_message',
                  new StringOption('Welcome to the guild {username}! Make sure to join our discord using /g discord!'),
                  false
                )
                .toJSON()
            ),
            false
          )
          .setValue('guild_member_leave', eventLogConfig, false)
          .setValue('guild_member_kick', eventLogConfig, false)
          .setValue('guild_member_promote', eventLogConfig, false)
          .setValue('guild_member_demote', eventLogConfig, false)
          .setValue('guild_mute_month', eventLogConfig, false)
          .setValue('repeat', eventConfig, false)
          .setValue('missing_perms', eventLogConfig, false)
          .setValue('bot_muted', eventLogConfig, false)
          .setValue('bad_use', eventConfig, false)
          .setValue('guild_member_invite', eventLogConfig, false)
          .setValue('guild_member_invite_offline', eventLogConfig, false)
          .setValue('guild_member_invite_fail', eventLogConfig, false)
          .setValue('guild_mute', eventLogConfig, false)
          .setValue('guild_unmute', eventLogConfig, false)
          .setValue('guild_member_mute', eventLogConfig, false)
          .setValue('guild_member_mute_already', eventLogConfig, false)
          .setValue('guild_member_unmute', eventLogConfig, false)
          .setValue('guild_member_set_rank_fail', eventLogConfig, false)
          .setValue('guild_member_not_in_guild', eventLogConfig, false)
          .setValue('guild_member_lowest_rank', eventLogConfig, false)
          .setValue('guild_member_already_has_rank', eventLogConfig, false)
          .toJSON()
      ),
      false
    );
    this.setValue(
      'commands',
      new SubConfigOption(
        new BaseConfigInstance()
          .setValue('8ball', minecraftCommandConfig, false)
          .setValue('bedwars', minecraftCommandConfig, false)
          .setValue('boo', minecraftCommandConfig, false)
          .setValue('boop', minecraftCommandConfig, false)
          .setValue('calculate', minecraftCommandConfig, false)
          .setValue('guild', minecraftCommandConfig, false)
          .setValue('guildexp', minecraftCommandConfig, false)
          .setValue('meow', minecraftCommandConfig, false)
          .setValue('player', minecraftCommandConfig, false)
          .setValue('guild_chat', new BooleanOption(true), false)
          .setValue('officer_chat', new BooleanOption(true), false)
          .setValue('prefix', new StringOption('!'), false)
          .setValue(
            'internal_button_reload_commands_minecraft',
            new InternalOption('internal_button_reload_commands_minecraft'),
            false
          )
          .toJSON()
      ),
      false
    );
  }
}

export default MinecraftConfig;
