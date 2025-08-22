import ConfigInstance from '../Private/ConfigInstance';
import StringOption from '../StringConfigOption';
import StringSelectionOption from '../StringSelectionConfigOption';

class DiscordConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('discord', update);
    this.updateData();
    this.setValue('guild_channel', new StringSelectionOption('', ['prefill_channels']), false);
    this.setValue('officer_channel', new StringSelectionOption('', ['prefill_channels']), false);
    this.setValue('logging_channel', new StringSelectionOption('', ['prefill_channels']), false);
    this.setValue('message_format', new StringOption('{chatType} > {rank} {username} {guildRank}: {message}'), false);
  }
}

export default DiscordConfig;
