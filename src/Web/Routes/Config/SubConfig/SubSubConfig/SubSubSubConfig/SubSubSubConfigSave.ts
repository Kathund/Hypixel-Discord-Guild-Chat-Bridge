import BaseConfigInstance from '../../../../../../Config/Private/BaseConfigInstance.js';
import BaseRoute from '../../../../../Private/BaseRoute.js';
import ConfigOption from '../../../../../../Config/Private/ConfigOption.js';
import ConfigSaveRoute from '../../../ConfigSave.js';
import Translate from '../../../../../../Private/Translate.js';
import type WebManager from '../../../../../WebManager.js';
import type { ConfigNames } from '../../../../../../Types/Configs.js';
import type { Request, Response } from 'express';

class SubSubSubConfigSaveRoute extends BaseRoute {
  private readonly web: WebManager;
  constructor(web: WebManager) {
    super();
    this.web = web;
    this.path = '/config/:configParam/:subConfigParam/:subSubConfigParam/:subSubSubConfigParam/save';
  }

  override post(req: Request, res: Response) {
    const { configParam, subConfigParam, subSubConfigParam, subSubSubConfigParam } = req.params;
    if (!configParam || !subConfigParam || !subSubConfigParam || !subSubSubConfigParam) {
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

    const subSubSubConfigData = subSubConfigData.getValue()[subSubSubConfigParam];
    if (subSubSubConfigData === undefined) return;
    if (!ConfigOption.isSubConfigConfigJSON(subSubSubConfigData)) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.sub.sub.sub.config') });
    }

    const parsedSubSubSubConfig = new BaseConfigInstance(subSubSubConfigData.value);
    ConfigSaveRoute.applyConfigData(parsedSubSubSubConfig, req.body);
    const subSubConfigValue = subSubConfigData.getValue();
    if (subSubConfigValue[subSubSubConfigParam]) {
      subSubConfigValue[subSubSubConfigParam].value = parsedSubSubSubConfig.toJSON();
      subSubConfigData.setValue(subSubConfigValue);
    }
    config.save();
    res.json({ success: true });
    config.save();
  }
}

export default SubSubSubConfigSaveRoute;
