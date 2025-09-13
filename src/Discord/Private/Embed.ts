import DataManager from '../../Data/DataManager.js';
import Translate from '../../Private/Translate.js';
import { type ColorResolvable, EmbedBuilder } from 'discord.js';
import { ReplaceVariables } from '../../Utils/StringUtils.js';
import type { Devs } from '../../Types/Data.js';
import type { EmbedDefaultColors } from '../../Types/Discord.js';

class Embed extends EmbedBuilder {
  constructor() {
    super();
    this.setTimestamp();
    this.setDev('kathund');
    this.setColorFromDefault('Blue');
  }

  setDev(dev: Devs): this {
    const devInfo = DataManager.getDevs()[dev];
    this.setFooter({
      text: ReplaceVariables(Translate('discord.embed.footer'), { user: devInfo.username }),
      iconURL: devInfo.url
    });
    return this;
  }

  setColorFromDefault(color: EmbedDefaultColors): this {
    super.setColor(DataManager.getColors()[color] as ColorResolvable);
    return this;
  }

  clearEmbed(): this {
    return this.setTimestamp(null).setFooter(null).setColor(null);
  }
}

export class ErrorEmbed extends Embed {
  constructor() {
    super();
    this.setTitle(Translate('discord.embed.error.title'));
    this.setDescription(Translate('discord.embed.error.description.reported'));
    this.setColorFromDefault('Red');
  }
}

export class SuccessEmbed extends Embed {
  constructor(description: string) {
    super();
    this.setTitle(Translate('discord.embed.success.title'));
    this.setDescription(description);
    this.setColorFromDefault('Green');
  }
}

export default Embed;
