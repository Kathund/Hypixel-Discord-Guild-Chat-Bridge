import ConfigManager from '../../../../Config/ConfigManager';
import Route from '../../../Private/BaseRoute';
import Translate from '../../../../Private/Translate';
import type WebManager from '../../../WebManager';
import type { Request, Response } from 'express';

class ConfigImportRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/data/config/import';
    this.type = 'post';
  }

  handle(req: Request, res: Response) {
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
