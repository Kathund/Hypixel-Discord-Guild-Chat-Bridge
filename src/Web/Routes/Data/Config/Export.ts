import ConfigManager from '../../../../Config/ConfigManager.js';
import Route from '../../../Private/BaseRoute.js';
import Translate from '../../../../Private/Translate.js';
import type WebManager from '../../../WebManager.js';
import type { Request, Response } from 'express';

class ConfigExportRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/data/config/export';
  }

  override handle(req: Request, res: Response) {
    try {
      res.status(200).send({ success: true, data: ConfigManager.convertConfigToBase64() });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, data: null, message: Translate('web.data.config.export.error') });
    }
  }
}

export default ConfigExportRoute;
