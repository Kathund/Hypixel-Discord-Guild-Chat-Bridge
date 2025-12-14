import BaseConfigInstance from '../../../../Config/Private/BaseConfigInstance.js';
import BaseRoute from '../../../Private/BaseRoute.js';
import ConfigSaveRoute from '../ConfigSave.js';
import Translate from '../../../../Private/Translate.js';
import type WebManager from '../../../WebManager.js';
import type { ConfigNames } from '../../../../Types/Configs.js';
import type { Request, Response } from 'express';

class SubConfigSaveRoute extends BaseRoute {
  private readonly web: WebManager;
  constructor(web: WebManager) {
    super();
    this.web = web;
    this.path = '/config/:configParam/:subConfigParam/save';
  }

  override post(req: Request, res: Response) {
    const { configParam, subConfigParam } = req.params;
    if (!configParam || !subConfigParam) {
      return res.status(400).json({ success: false, message: Translate('web.route.error.missing.param') });
    }

    if ([configParam, subConfigParam].some((ignore) => ['favicon.ico', 'save'].includes(ignore))) return;
    const config = this.web.Application.config[configParam as ConfigNames];
    if (config === undefined) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.config') });
    }
    const subConfigData = config.getValue(subConfigParam);
    if (subConfigData === undefined || !subConfigData.isSubConfigConfig()) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.sub.config') });
    }

    const parsedSubConfig = new BaseConfigInstance(subConfigData.getValue());
    ConfigSaveRoute.applyConfigData(parsedSubConfig, req.body);
    subConfigData.setValue(parsedSubConfig.toJSON());
    config.setValue(subConfigParam, subConfigData);

    config.save();
    res.json({ success: true });
    config.save();
  }
}

export default SubConfigSaveRoute;
