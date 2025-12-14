import BaseConfigInstance from '../../../Config/Private/BaseConfigInstance.js';
import BaseRoute from '../../Private/BaseRoute.js';
import SubConfigOption from '../../../Config/Options/SubConfig.js';
import Translate from '../../../Private/Translate.js';
import type WebManager from '../../WebManager.js';
import type { ConfigNames } from '../../../Types/Configs.js';
import type { Request, Response } from 'express';

class ConfigSaveRoute extends BaseRoute {
  private readonly web: WebManager;
  constructor(web: WebManager) {
    super();
    this.web = web;
    this.path = '/config/:configParam/save';
  }

  override post(req: Request, res: Response) {
    const { configParam } = req.params;
    if (!configParam) {
      return res.status(400).json({ success: false, message: Translate('web.route.error.missing.param') });
    }
    if (['favicon.ico', 'save'].includes(configParam)) return;
    const config = this.web.Application.config[configParam as ConfigNames];
    if (config === undefined) return;
    ConfigSaveRoute.applyConfigData(config, req.body);
    config.save();
    res.json({ success: true });
    config.save();
  }

  static applyConfigData(targetConfig: BaseConfigInstance, configData: Record<string, any>): void {
    Object.keys(configData).forEach((option) => {
      const value = targetConfig.getValue(option);
      if (value === undefined) return;

      if (value instanceof SubConfigOption) {
        const nestedConfig = value.getValue();
        if (nestedConfig !== undefined && typeof configData[option] === 'object') {
          this.applyConfigData(new BaseConfigInstance(nestedConfig), configData[option]);
          value.setValue(nestedConfig);
          targetConfig.setValue(option, value);
        }
        return;
      }

      const data = value.toJSON();
      data.value = configData[option];
      if (data.type === 'array' && typeof configData[option] === 'string') data.value = configData[option].split(',');
      const fixedData = BaseConfigInstance.getConfigOption(data);
      if (fixedData !== undefined) targetConfig.setValue(option, fixedData);
    });
  }
}

export default ConfigSaveRoute;
