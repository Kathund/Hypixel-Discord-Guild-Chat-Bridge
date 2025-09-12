import Route from '../../../Private/BaseRoute.js';
import type WebManager from '../../../WebManager.js';
import type { Request, Response } from 'express';

class ForceSaveRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/force/save';
    this.type = 'post';
  }

  override handle(req: Request, res: Response) {
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
