import BaseConfigInstance from '../../../Config/Private/BaseConfigInstance.js';
import Route from '../../Private/BaseRoute.js';
import type WebManager from '../../WebManager.js';
import type { Request, Response } from 'express';

class ConfigSaveRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:config/save';
    this.type = 'post';
  }

  override handle(req: Request, res: Response) {
    if (!req.params.config) {
      res.status(400).json({ success: false, message: 'Missing params' });
      return;
    }
    if (['favicon.ico', 'save'].includes(req.params.config)) return;
    const configName = req.params.config as keyof typeof this.web.Application.config;
    const config = this.web.Application.config[configName];
    if (config === undefined) return;
    const configData = req.body;
    Object.keys(configData).forEach((option) => {
      const value = config.getValue(option);
      if (value === undefined) return;
      const data = value.toJSON();
      data.value = configData[option];
      if (data.type === 'array') data.value = configData[option].split(',');
      const fixedData = BaseConfigInstance.getConfigOption(data);
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
