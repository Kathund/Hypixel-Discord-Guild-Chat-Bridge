import ConfigInstance from '../../../Config/Private/ConfigInstance';
import Route from '../../Private/BaseRoute';
import type WebManager from '../../WebManager';
import type { Request, Response } from 'express';

class ConfigSaveRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:config/save';
    this.type = 'post';
  }

  handle(req: Request, res: Response) {
    if (['favicon.ico', 'save', 'commands'].includes(req.params.config)) return;
    const configName = req.params.config as keyof typeof this.web.Application.config;
    const config = this.web.Application.config[configName];
    if (config === undefined) return;
    const configData = req.body;
    Object.keys(configData).forEach((option) => {
      const value = config.getValue(option);
      if (value === undefined) return;
      const data = value.toJSON();
      data.value = configData[option];
      const fixedData = ConfigInstance.getConfigOption(data);
      if (fixedData !== undefined) {
        config.setValue(option, fixedData);
      }
    });
    config.save();
    res.json({ success: true });
    config.save();
  }
}

export default ConfigSaveRoute;
