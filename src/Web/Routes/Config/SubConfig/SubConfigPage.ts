import ConfigPageRoute from '../ConfigPage';
import Route from '../../../Private/BaseRoute';
import type WebManager from '../../../WebManager';
import type { Request, Response } from 'express';

class SubConfigPageRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:config/:subconfig/';
  }

  handle(req: Request, res: Response) {
    if (['favicon.ico', 'save'].includes(req.params.config)) return;
    if (['favicon.ico', 'save'].includes(req.params.subconfig)) return;
    const configName = req.params.config as keyof typeof this.web.Application.config;
    const config = this.web.Application.config[configName];
    if (!config) {
      res.status(404).send('Config section not found');
      return;
    }
    const subConfig = config.getValue(req.params.subconfig);
    if (subConfig === undefined || !subConfig.isSubConfigConfig()) {
      res.status(404).send('Sub Config section not found');
      return;
    }
    const subConfigData = subConfig.getValue();
    if (subConfigData === undefined) {
      res.status(404).send('Sub Config section not found');
      return;
    }
    res.render('configPage', {
      config: ConfigPageRoute.parseConfigForWeb(subConfigData, `${configName}.${req.params.subconfig}`),
      globalData: { ...this.web.getData(), path: req.path.split('/') }
    });
  }
}

export default SubConfigPageRoute;
