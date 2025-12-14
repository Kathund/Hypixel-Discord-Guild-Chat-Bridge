import BaseRoute from '../../../../../Private/BaseRoute.js';
import ConfigOption from '../../../../../../Config/Private/ConfigOption.js';
import ConfigPageRoute from '../../../ConfigPage.js';
import Translate from '../../../../../../Private/Translate.js';
import type WebManager from '../../../../../WebManager.js';
import type { ConfigNames } from '../../../../../../Types/Configs.js';
import type { Request, Response } from 'express';

class SubSubSubConfigPageRoute extends BaseRoute {
  private readonly web: WebManager;
  constructor(web: WebManager) {
    super();
    this.web = web;
    this.path = '/config/:configParam/:subConfigParam/:subSubConfigParam/:subSubSubConfigParam';
  }

  override get(req: Request, res: Response) {
    const { configParam, subConfigParam, subSubConfigParam, subSubSubConfigParam } = req.params;
    if (!configParam || !subConfigParam || !subSubConfigParam || !subSubSubConfigParam) {
      return res.status(400).json({ success: false, message: Translate('web.route.error.missing.param') });
    }
    if (
      [configParam, subConfigParam, subSubConfigParam, subSubSubConfigParam].some((ignore) =>
        ['favicon.ico', 'save'].includes(ignore)
      )
    ) {
      return;
    }
    const config = this.web.Application.config[configParam as ConfigNames];
    if (config === undefined) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.config') });
    }
    const subConfig = config.getValue(subConfigParam);
    if (!subConfig?.isSubConfigConfig()) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.sub.config') });
    }
    const subConfigData = subConfig.getValue();
    if (subConfigData === undefined) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.sub.config') });
    }
    const subSubConfigData = subConfigData[subSubConfigParam];
    if (subSubConfigData === undefined || !ConfigOption.isSubConfigConfigJSON(subSubConfigData)) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.sub.sub.config') });
    }
    const subSubSubConfigData = subSubConfigData.value[subSubSubConfigParam];
    if (subSubSubConfigData === undefined || !ConfigOption.isSubConfigConfigJSON(subSubSubConfigData)) {
      return res.status(404).json({ success: false, message: Translate('web.route.error.missing.sub.sub.sub.config') });
    }
    res.render('configPage', {
      config: ConfigPageRoute.parseConfigForWeb(
        subSubSubConfigData.value,
        `${configParam}.${subConfigParam}.${subSubConfigParam}.${subSubSubConfigParam}`
      ),
      globalData: { ...this.web.getData(), path: req.path.split('/') }
    });
  }
}

export default SubSubSubConfigPageRoute;
