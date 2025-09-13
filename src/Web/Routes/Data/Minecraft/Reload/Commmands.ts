import Route from '../../../../Private/BaseRoute.js';
import type WebManager from '../../../../WebManager.js';
import type { Request, Response } from 'express';

class MinecraftCommandDataReloadRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/data/minecraft/reload/commands';
    this.type = 'post';
  }

  override async handle(req: Request, res: Response) {
    try {
      await this.web.Application.minecraft.commandHandler.deployCommands();
      res.status(200).send({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false });
    }
  }
}

export default MinecraftCommandDataReloadRoute;
