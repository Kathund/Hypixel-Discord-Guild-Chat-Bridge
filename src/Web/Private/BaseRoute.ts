import Translate from '../../Private/Translate.js';
import type { Request, Response } from 'express';

class BaseRoute {
  path: string;
  constructor() {
    this.path = '/';
  }

  get(req: Request, res: Response) {
    throw new Error(Translate('web.error.missingRoute'));
  }

  post(req: Request, res: Response) {
    throw new Error(Translate('web.error.missingRoute'));
  }
}

export default BaseRoute;
