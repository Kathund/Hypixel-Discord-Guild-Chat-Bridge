import ConfigOption from '../../../Config/Private/ConfigOption';
import ReplaceVariables from '../../../Private/ReplaceVariables';
import Route from '../../Private/BaseRoute';
import Translate, { getTranslations } from '../../../Private/Translate';
import type WebManager from '../../WebManager';
import type { Language } from '../../../types/main';
import type { Request, Response } from 'express';
import type { WebParsedConfigJSON } from '../../../types/Configs';

class ConfigPageRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/:config';
  }

  handle(req: Request, res: Response) {
    if (['favicon.ico', 'save'].includes(req.params.config)) return;
    const configName = req.params.config as keyof typeof this.web.Application.config;
    const config = this.web.Application.config[configName].toJSON();
    if (!config) {
      res.status(404).send('Config section not found');
      return;
    }
    const converted: WebParsedConfigJSON[] = [];
    Object.keys(config).forEach((option) => {
      const convertedData: WebParsedConfigJSON = {
        internal: option,
        name: Translate(`config.options.${configName}.${option}`),
        description: Translate(`config.options.${configName}.${option}.description`),
        ...config[option]
      };
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
      }
      converted.push(convertedData);
    });
    res.render('configPage', {
      config: converted,
      globalData: { ...this.web.getData(), path: req.path.split('/') }
    });
  }
}

export default ConfigPageRoute;
