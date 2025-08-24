import ConfigOption from '../../../../Config/Private/ConfigOption';
import Route from '../../../Private/BaseRoute';
import Translate from '../../../../Private/Translate';
import type WebManager from '../../../WebManager';
import type { Request, Response } from 'express';
import type { WebParsedConfigJSON } from '../../../../types/Configs';

class CommandPageRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/commands/:command';
  }

  handle(req: Request, res: Response) {
    if (['favicon.ico', 'save'].includes(req.params.command)) return;
    const commandName = req.params.command;
    const command = this.web.Application.config.commands.getValue(commandName);
    if (!command || command.isCommandOption() === false) return;
    const converted: WebParsedConfigJSON[] = [];
    Object.keys(command.getValue()).forEach((option) => {
      const convertedData: WebParsedConfigJSON = {
        internal: option,
        name: Translate(`config.options.commands.${commandName}.${option}`),
        description: Translate(`config.options.commands.${commandName}.${option}.description`),
        ...(command.getValue() as any)[option]
      };

      if (ConfigOption.isStringSelectionConfigJSONWeb(convertedData)) {
        convertedData.options = (convertedData.options as unknown as string[]).map((configOption) => {
          if (configOption.startsWith('prefill_')) {
            return { name: configOption, description: configOption, internal: configOption };
          }
          return {
            name: Translate(`config.options.commands.${commandName}.${option}.${configOption}`),
            description: configOption,
            internal: configOption
          };
        });
      }
      converted.push(convertedData);
    });

    res.render('configPage', {
      config: converted,
      globalData: { ...this.web.getData(), path: req.path.split('/') }
    });
  }
}

export default CommandPageRoute;
