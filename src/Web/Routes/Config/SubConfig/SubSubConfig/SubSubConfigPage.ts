import ConfigOption from '../../../../../Config/Private/ConfigOption';
import ConfigPageRoute from '../../ConfigPage';
import Route from '../../../../Private/BaseRoute';
import type WebManager from '../../../../WebManager';
import type { Request, Response } from 'express';

class SubSubConfigPageRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:config/:subconfig/:subsubconfig';
  }

  handle(req: Request, res: Response) {
    if (['favicon.ico', 'save'].includes(req.params.config)) return;
    if (['favicon.ico', 'save'].includes(req.params.subconfig)) return;
    if (['favicon.ico', 'save'].includes(req.params.subsubconfig)) return;
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
    const subSubConfigData = subConfigData[req.params.subsubconfig];
    if (subSubConfigData === undefined || !ConfigOption.isSubConfigConfigJSON(subSubConfigData)) {
      return;
    }
    res.render('configPage', {
      config: ConfigPageRoute.parseConfigForWeb(
        subSubConfigData.value,
        `${configName}.${req.params.subconfig}.${req.params.subsubconfig}`
      ),
      globalData: { ...this.web.getData(), path: req.path.split('/') }
    });
  }
}

export default SubSubConfigPageRoute;
