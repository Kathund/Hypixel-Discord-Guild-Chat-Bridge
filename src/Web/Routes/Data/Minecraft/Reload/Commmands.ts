import BaseRoute from '../../../../Private/BaseRoute.js';
import type WebManager from '../../../../WebManager.js';
import type { Request, Response } from 'express';

class MinecraftCommandDataReloadRoute extends BaseRoute {
  private readonly web: WebManager;
  constructor(web: WebManager) {
    super();
    this.web = web;
    this.path = '/data/minecraft/reload/commands';
  }

  override async post(req: Request, res: Response) {
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
