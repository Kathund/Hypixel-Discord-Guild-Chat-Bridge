import ConfigManager from '../../../../Config/ConfigManager';
import Route from '../../../Private/BaseRoute';
import Translate from '../../../../Private/Translate';
import { ConfigInstanceData } from '../../../../types/Configs';
import type WebManager from '../../../WebManager';
import type { Request, Response } from 'express';

class ConfigExportRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/data/config/export';
  }

  static convertConfigToBase64(): string {
    const configs = new ConfigManager(false);
    const data: { [key: string]: ConfigInstanceData } = {};
    Object.keys(configs)
      .filter((key) => !['Application'].includes(key))
      .forEach((key) => {
        const config = configs[key as keyof typeof configs];
        if (config === undefined) return;
        data[key] = config.toJSON();
      });
    return Buffer.from(JSON.stringify(data), 'utf-8').toString('base64');
  }

  handle(req: Request, res: Response) {
    try {
      res.status(200).send({ success: true, data: ConfigExportRoute.convertConfigToBase64() });
    } catch (error) {
      console.error(error);
      this.web.guildData = null;
      res.status(500).send({ success: false, data: null, message: Translate('web.data.discord.error') });
    }
  }
}

export default ConfigExportRoute;
