import Translate from '../../Private/Translate';
import WebManger from '../WebManager';
import type { Request, Response } from 'express';
import type { RouteType } from '../../types/Web';

class Route {
  readonly web: WebManger;
  path: string;
  type: RouteType;
  constructor(web: WebManger) {
    this.web = web;
    this.path = '/';
    this.type = 'get';
  }

  handle(req: Request, res: Response): Promise<void> | void {
    throw new Error(Translate('error.missingRoute'));
  }
}

export default Route;
