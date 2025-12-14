import BaseRoute from '../../../Private/BaseRoute.js';
import type WebManager from '../../../WebManager.js';
import type { Request, Response } from 'express';

class ForceSaveRoute extends BaseRoute {
  private readonly web: WebManager;
  constructor(web: WebManager) {
    super();
    this.web = web;
    this.path = '/force/save';
  }

  override post(req: Request, res: Response) {
    Object.keys(this.web.Application.config)
      .filter((key) => !['Application'].includes(key))
      .forEach((key) => {
        const config = this.web.Application.config[key as keyof typeof this.web.Application.config];
        if (config === undefined) return;
        config.save();
      });
  }
}

export default ForceSaveRoute;
