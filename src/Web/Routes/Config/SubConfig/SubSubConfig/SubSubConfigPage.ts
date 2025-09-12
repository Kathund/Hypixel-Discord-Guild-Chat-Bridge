import ConfigOption from '../../../../../Config/Private/ConfigOption.js';
import ConfigPageRoute from '../../ConfigPage.js';
import Route from '../../../../Private/BaseRoute.js';
import type WebManager from '../../../../WebManager.js';
import type { Request, Response } from 'express';

class SubSubConfigPageRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:config/:subconfig/:subsubconfig';
  }

  override handle(req: Request, res: Response) {
    if (!req.params.config || !req.params.subconfig || !req.params.subsubconfig) {
      res.status(400).json({ success: false, message: 'Missing params' });
      return;
    }
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
