import BaseRoute from '../../../Private/BaseRoute.js';
import ConfigManager from '../../../../Config/ConfigManager.js';
import Translate from '../../../../Private/Translate.js';
import type { Request, Response } from 'express';

class ConfigImportRoute extends BaseRoute {
  constructor() {
    super();
    this.path = '/data/config/import';
  }

  override post(req: Request, res: Response) {
    try {
      const body = req.body;
      if (!body) {
        res.status(400).send({ success: false, data: null, message: Translate('web.data.config.import.error') });
        return;
      }
      ConfigManager.importConfigFromBase64(body);
      res.status(200).send({ success: true, data: null });
      console.other(Translate('config.import.success'));
      process.exit(1);
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, data: null, message: Translate('web.data.config.import.error') });
    }
  }
}

export default ConfigImportRoute;
