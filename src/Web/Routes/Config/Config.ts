import Route from '../../Private/BaseRoute.js';
import Translate from '../../../Private/Translate.js';
import type WebManager from '../../WebManager.js';
import type { Request, Response } from 'express';
import type { WebParsedData } from '../../../Types/Configs.js';

class ConfigRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config';
  }

  override handle(req: Request, res: Response) {
    const configs: WebParsedData[] = [];
    Object.keys(this.web.Application.config)
      .filter((config) => config !== 'Application')
      .forEach((config) => {
        configs.push({
          internal: config,
          name: Translate(`config.options.${config}`),
          description: Translate(`config.options.${config}.description`),
          open: Translate(`config.options.${config}.open`),
          path: `/config/${config}`
        });
      });
    res.render('config', { configs, globalData: { ...this.web.getData(), path: req.path.split('/') } });
  }
}

export default ConfigRoute;
