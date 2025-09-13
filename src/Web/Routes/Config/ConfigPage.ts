import ConfigOption from '../../../Config/Private/ConfigOption.js';
import Route from '../../Private/BaseRoute.js';
import Translate, { getTranslations } from '../../../Private/Translate.js';
import { ReplaceVariables } from '../../../Utils/StringUtils.js';
import type WebManager from '../../WebManager.js';
import type { ConfigInstanceData, WebParsedConfigJSON } from '../../../Types/Configs.js';
import type { Language } from '../../../Types/Data.js';
import type { Request, Response } from 'express';

class ConfigPageRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:config';
  }

  override handle(req: Request, res: Response) {
    if (!req.params.config) {
      res.status(400).json({ success: false, message: 'Missing params' });
      return;
    }
    if (['favicon.ico', 'save'].includes(req.params.config)) return;
    const configName = req.params.config as keyof typeof this.web.Application.config;
    const config = this.web.Application.config[configName].toJSON();
    if (!config) {
      res.status(404).send('Config section not found');
      return;
    }
    res.render('configPage', {
      config: ConfigPageRoute.parseConfigForWeb(config, configName),
      globalData: { ...this.web.getData(), path: req.path.split('/') }
    });
  }

  static parseConfigForWeb(config: ConfigInstanceData, configName: string): WebParsedConfigJSON[] {
    const converted: WebParsedConfigJSON[] = [];
    Object.keys(config).forEach((option) => {
      const configData = config[option];
      if (!configData) return;
      const convertedData: WebParsedConfigJSON = {
        internal: option,
        name: Translate(`config.options.${configName}.${option}`),
        description: Translate(`config.options.${configName}.${option}.description`),
        ...configData
      };

      if (
        ConfigOption.isSubConfigConfigJSON(convertedData) ||
        (ConfigOption.isInternalConfigJSON(convertedData) && convertedData.internal.split('_')[1] === 'button')
      ) {
        convertedData.open = Translate(`config.options.${configName}.${option}.open`);
        convertedData.path = `/config/${configName.replaceAll('.', '/')}/${option}`;
      }

      if (ConfigOption.isStringSelectionConfigJSONWeb(convertedData)) {
        if (convertedData.internal === 'lang') {
          const options = (convertedData.options as unknown as string[]).map((configOption) => {
            const amount = Math.floor(
              (Object.keys(getTranslations(configOption as Language)).length /
                Object.keys(getTranslations('en_us')).length) *
                100
            );
            return {
              name: ReplaceVariables(Translate(`config.options.${configName}.${option}.format`), {
                lang: Translate(`config.options.${configName}.${option}.${configOption}`),
                amount: ReplaceVariables(Translate(`config.options.${configName}.${option}.amount`), { amount })
              }),
              description: configOption,
              internal: configOption,
              amount
            };
          });
          convertedData.options = options.sort((a, b) => b.amount - a.amount);
        } else {
          convertedData.options = (convertedData.options as unknown as string[]).map((configOption) => {
            if (configOption.startsWith('prefill_')) {
              return { name: configOption, description: configOption, internal: configOption };
            }
            return {
              name: Translate(`config.options.${configName}.${option}.${configOption}`),
              description: configOption,
              internal: configOption
            };
          });
        }
        convertedData.allowEmpty = convertedData.defaultValue === '';
      }
      converted.push(convertedData);
    });
    return converted;
  }
}

export default ConfigPageRoute;
