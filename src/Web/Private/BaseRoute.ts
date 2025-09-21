import Translate from '../../Private/Translate.js';
import WebManger from '../WebManager.js';
import type { Request, Response } from 'express';
import type { RouteType } from '../../Types/Web.js';

class Route {
  readonly web: WebManger;
  path: string;
  type: RouteType;
  constructor(web: WebManger) {
    this.web = web;
    this.path = '/';
    this.type = 'get';
  }

  handle(req: Request, res: Response) {
    throw new Error(Translate('web.error.missingRoute'));
  }
}

export default Route;
