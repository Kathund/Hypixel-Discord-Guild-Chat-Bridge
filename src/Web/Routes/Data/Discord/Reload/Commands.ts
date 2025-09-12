import Route from '../../../../Private/BaseRoute.js';
import Translate from '../../../../../Private/Translate.js';
import type WebManager from '../../../../WebManager.js';
import type { Request, Response } from 'express';

class CommandDataRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/data/discord/reload/commands';
    this.type = 'post';
  }

  override async handle(req: Request, res: Response) {
    try {
      const client = this.web.Application.discord.client;
      if (client === undefined || !client.isReady()) {
        this.web.guildData = null;
        res.status(500).send({ success: false, data: null, message: Translate('web.data.discord.error.client') });
        return;
      }
      await this.web.Application.discord.commandHandler.deployCommands();
      res.status(200).send({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false });
    }
  }
}

export default CommandDataRoute;
