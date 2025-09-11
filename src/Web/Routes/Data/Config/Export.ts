import ConfigManager from '../../../../Config/ConfigManager';
import Route from '../../../Private/BaseRoute';
import Translate from '../../../../Private/Translate';
import type WebManager from '../../../WebManager';
import type { Request, Response } from 'express';

class ConfigExportRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/data/config/export';
  }

  handle(req: Request, res: Response) {
    try {
      res.status(200).send({ success: true, data: ConfigManager.convertConfigToBase64() });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, data: null, message: Translate('web.data.config.export.error') });
    }
  }
}

export default ConfigExportRoute;
