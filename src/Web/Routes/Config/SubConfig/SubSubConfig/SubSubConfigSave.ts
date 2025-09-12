import BaseConfigInstance from '../../../../../Config/Private/BaseConfigInstance.js';
import ConfigOption from '../../../../../Config/Private/ConfigOption.js';
import Route from '../../../../Private/BaseRoute.js';
import SubConfigOption from '../../../../../Config/Options/SubConfig.js';
import type WebManager from '../../../../WebManager.js';
import type { Request, Response } from 'express';

class ConfigSaveRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:config/:subconfig/:subsubconfig/save';
    this.type = 'post';
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
      res.status(404).json({ success: false, message: 'Config section not found' });
      return;
    }
    const subConfig = config.getValue(req.params.subconfig);
    if (subConfig === undefined || !subConfig.isSubConfigConfig()) {
      res.status(404).json({ success: false, message: 'Sub Config section not found' });
      return;
    }
    const subConfigData = subConfig.getValue();
    if (subConfigData === undefined) {
      res.status(404).json({ success: false, message: 'Sub Config section not found' });
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
      const optionData = option.getValue()[key];
      if (!optionData) return;
      const fixedOption = BaseConfigInstance.getConfigOption(optionData);
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
      const optionData = oldSubConfig[key];
      if (!optionData) return;
      const fixedOption = BaseConfigInstance.getConfigOption(optionData);
      if (fixedOption !== undefined) oldSubConfigOptions[key] = fixedOption;
    });
    const subconfigOption = oldSubConfigOptions[req.params.subsubconfig];
    if (!subconfigOption) {
      res.status(500).json({ success: false, message: "Something wen't wrong while getting the sub config option" });
      return;
    }
    subconfigOption.setValue(option?.getValue());
    const newSubConfig = new BaseConfigInstance();
    Object.keys(oldSubConfigOptions).forEach((key) => {
      const newValue = oldSubConfigOptions[key];
      if (!newValue) return;
      newSubConfig.setValue(key, newValue);
    });
    config.setValue(req.params.subconfig, new SubConfigOption(newSubConfig.toJSON()));
    config.save();
    res.json({ success: true });
    config.save();
  }
}

export default ConfigSaveRoute;
