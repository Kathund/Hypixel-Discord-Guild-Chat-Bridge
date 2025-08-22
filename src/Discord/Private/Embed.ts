import ReplaceVariables from '../../Private/ReplaceVariables';
import Translate from '../../Private/Translate';
import { EmbedBuilder } from 'discord.js';
import type { Dev, Devs, EmbedDefaultColors } from '../../types/main';

// eslint-disable-next-line import/exports-last
export const devInfos: { [key in Devs]: Dev } = {
  kathund: {
    username: '.kathund',
    id: '1276524855445164098',
    types: ['maintainer'],
    url: 'https://i.imgur.com/uUuZx2E.png'
  },
  duckysolucky: {
    username: 'duckysolucky',
    id: '486155512568741900',
    types: ['contributor'],
    url: 'https://imgur.com/tgwQJTX.png'
  },
  georgeFilos: {
    username: 'george_filos',
    id: '177083022305263616',
    types: ['contributor'],
    url: 'https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp'
  }
};

const embedDefaultColors: { [key in EmbedDefaultColors]: number } = {
  Green: 0x7be425,
  Red: 0xed474a,
  Blue: 0x17bebb
};

class Embed extends EmbedBuilder {
  constructor() {
    super();
    this.setTimestamp();
    this.setDev('kathund');
    this.setColorFromDefault('Blue');
  }

  setDev(dev: Devs): this {
    this.setFooter({
      text: ReplaceVariables(Translate('discord.embed.footer'), { user: devInfos[dev].username }),
      iconURL: devInfos[dev].url
    });
    return this;
  }

  setColorFromDefault(color: EmbedDefaultColors): this {
    this.setColor(embedDefaultColors[color]);
    return this;
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
