import BaseRoute from '../../../../Private/BaseRoute.js';
import Translate from '../../../../../Private/Translate.js';
import type WebManager from '../../../../WebManager.js';
import type { Request, Response } from 'express';

class DiscordCommandDataReloadRoute extends BaseRoute {
  private readonly web: WebManager;
  constructor(web: WebManager) {
    super();
    this.web = web;
    this.path = '/data/discord/reload/commands';
  }

  override async post(req: Request, res: Response) {
    try {
      const client = this.web.Application.discord.client;
      if (client === undefined || !client.isReady()) {
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

export default DiscordCommandDataReloadRoute;
