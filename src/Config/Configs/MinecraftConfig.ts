import BooleanOption from '../BooleanConfigOption';
import ConfigInstance from '../Private/ConfigInstance';
import FuckConfig from './FuckConfig';
import NumberOption from '../NumberConfigOption';
import StringOption from '../StringConfigOption';

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
    this.setValue('fuck', new FuckConfig(true), false);
  }
}

export default MinecraftConfig;
