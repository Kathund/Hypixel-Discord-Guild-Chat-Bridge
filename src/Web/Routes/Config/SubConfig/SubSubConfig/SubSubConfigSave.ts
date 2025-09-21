import BaseConfigInstance from '../../../../../Config/Private/BaseConfigInstance.js';
import ConfigSaveRoute from '../../ConfigSave.js';
import Route from '../../../../Private/BaseRoute.js';
import Translate from '../../../../../Private/Translate.js';
import type WebManager from '../../../../WebManager.js';
import type { ConfigNames } from '../../../../../Types/Configs.js';
import type { Request, Response } from 'express';

class SubSubConfigSaveRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:configParam/:subConfigParam/:subSubConfigParam/save';
    this.type = 'post';
  }

  override handle(req: Request, res: Response) {
    const { configParam, subConfigParam, subSubConfigParam } = req.params;
    if (!configParam || !subConfigParam || !subSubConfigParam) {
      return res.status(400).json({ success: false, message: Translate('web.route.error.missing.param') });
    }

    if ([configParam, subConfigParam, subSubConfigParam].some((ignore) => ['favicon.ico', 'save'].includes(ignore))) {
      return;
    }
    const config = this.web.Application.config[configParam as ConfigNames];
    if (config === undefined) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.config') });
    }

    const subConfigData = config.getValue(subConfigParam);
    if (!subConfigData?.isSubConfigConfig()) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.sub.config') });
    }

    const subSubConfigData = new BaseConfigInstance(subConfigData.getValue()).getValue(subSubConfigParam);
    if (!subSubConfigData?.isSubConfigConfig()) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.sub.sub.config') });
    }

    const parsedSubSubConfig = new BaseConfigInstance(subSubConfigData.getValue());
    ConfigSaveRoute.applyConfigData(parsedSubSubConfig, req.body);
    const subConfigValue = subConfigData.getValue();
    if (subConfigValue[subSubConfigParam]) {
      subConfigValue[subSubConfigParam].value = parsedSubSubConfig.toJSON();
      subConfigData.setValue(subConfigValue);
      config.setValue(subConfigParam, subConfigData);
    }

    config.save();
    res.json({ success: true });
    config.save();
  }
}

export default SubSubConfigSaveRoute;
