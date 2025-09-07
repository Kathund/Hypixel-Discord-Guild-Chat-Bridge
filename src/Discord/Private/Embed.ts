import DataManager from '../../Data/DataManager';
import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import { EmbedBuilder } from 'discord.js';
import type { Devs, EmbedDefaultColors } from '../../types/main';

const embedDefaultColors: { [key in EmbedDefaultColors]: number } = { Green: 0x00ff3c, Red: 0xed474a, Blue: 0x17bebb };

class Embed extends EmbedBuilder {
  constructor() {
    super();
    this.setTimestamp();
    this.setDev('kathund');
    this.setColorFromDefault('Blue');
  }

  setDev(dev: Devs): this {
    const devInfo = new DataManager().getDevs()[dev];
    this.setFooter({
      text: ReplaceVariables(Translate('discord.embed.footer'), { user: devInfo.username }),
      iconURL: devInfo.url
    });
    return this;
  }

  setColorFromDefault(color: EmbedDefaultColors): this {
    this.setColor(embedDefaultColors[color]);
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

export default Embed;
