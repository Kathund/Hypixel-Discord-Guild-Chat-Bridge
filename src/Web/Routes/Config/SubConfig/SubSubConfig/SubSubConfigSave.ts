import BaseConfigInstance from '../../../../../Config/Private/BaseConfigInstance';
import ConfigOption from '../../../../../Config/Private/ConfigOption';
import Route from '../../../../Private/BaseRoute';
import SubConfigOption from '../../../../../Config/Options/SubConfig';
import type WebManager from '../../../../WebManager';
import type { Request, Response } from 'express';

class ConfigSaveRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:config/:subconfig/:subsubconfig/save';
    this.type = 'post';
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
    const option = BaseConfigInstance.getConfigOption(subSubConfigData);
    const options: Record<string, ConfigOption> = {};
    if (option === undefined || !option.isSubConfigConfig()) return;
    Object.keys(option.getValue()).forEach((key) => {
      const fixedOption = BaseConfigInstance.getConfigOption(option.getValue()[key]);
      if (fixedOption !== undefined) options[key] = fixedOption;
    });
    const configData = req.body;
    const newConfig = new BaseConfigInstance();
    Object.keys(configData).forEach((key) => {
      const foundOption = options[key];
      if (foundOption === undefined) return;
      newConfig.setValue(
        key,
        foundOption.setValue(foundOption.isArrayOption() ? configData[key].split(',') : configData[key])
      );
    });
    option.setValue(newConfig.toJSON());
    const oldSubConfig = subConfig.getValue();
    const oldSubConfigOptions: Record<string, ConfigOption> = {};
    Object.keys(oldSubConfig).forEach((key) => {
      const fixedOption = BaseConfigInstance.getConfigOption(oldSubConfig[key]);
      if (fixedOption !== undefined) oldSubConfigOptions[key] = fixedOption;
    });
    oldSubConfigOptions[req.params.subsubconfig].setValue(option?.getValue());
    const newSubConfig = new BaseConfigInstance();
    Object.keys(oldSubConfigOptions).forEach((key) => {
      newSubConfig.setValue(key, oldSubConfigOptions[key]);
    });
    config.setValue(req.params.subconfig, new SubConfigOption(newSubConfig.toJSON()));
    config.save();
    res.json({ success: true });
    config.save();
  }
}

export default ConfigSaveRoute;
