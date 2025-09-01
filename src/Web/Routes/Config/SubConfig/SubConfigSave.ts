import Route from '../../../Private/BaseRoute';
import type WebManager from '../../../WebManager';
import type { Request, Response } from 'express';

class ConfigSaveRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:config/:subconfig/save';
    this.type = 'post';
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
    const configData = req.body;
    Object.keys(configData).forEach((option) => {
      const value = subConfigData[option];
      if (value === undefined) return;
      value.value = configData[option];
      subConfigData[option] = value;
    });
    subConfig.setValue(subConfigData);
    config.setValue(req.params.subconfig, subConfig);
    config.save();
    res.json({ success: true });
    config.save();
  }
}

export default ConfigSaveRoute;
