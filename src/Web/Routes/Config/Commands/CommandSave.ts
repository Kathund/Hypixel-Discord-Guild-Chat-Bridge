import BooleanOption from '../../../../Config/BooleanConfigOption';
import CommandOption, { CommandOptionData } from '../../../../Config/CommandConfigOption';
import Route from '../../../Private/BaseRoute';
import StringSelectionOption from '../../../../Config/StringSelectionConfigOption';
import type WebManager from '../../../WebManager';
import type { Request, Response } from 'express';

class CommandSaveRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/config/commands/:command/save';
    this.type = 'post';
  }

  handle(req: Request, res: Response) {
    const commandName = req.params.command;
    const command = this.web.Application.config.commands.getValue(commandName);
    if (!command || command.isCommandOption() === false) return;
    const configData = req.body;
    this.web.Application.config.commands.setValue(
      commandName,
      new CommandOption(
        new CommandOptionData().setDefault().toJSON(),
        new CommandOptionData()
          .setEnabled(new BooleanOption(configData.enabled ?? true))
          .setRequiredRole(new StringSelectionOption('', ['prefill_roles'], configData.requiredRole ?? ''))
          .toJSON()
      )
    );
    this.web.Application.config.commands.save();
    res.json({ success: true });
    this.web.Application.config.commands.save();
  }
}

export default CommandSaveRoute;
