import BaseRoute from '../Private/BaseRoute.js';
import Translate from '../../Private/Translate.js';
import type WebManager from '../WebManager.js';
import type { Request, Response } from 'express';

class HomeRoute extends BaseRoute {
  private readonly web: WebManager;
  constructor(web: WebManager) {
    super();
    this.web = web;
    this.path = '/';
  }

  override get(req: Request, res: Response) {
    const pages = ['config'];
    res.render('index', {
      pages: pages.map((page) => {
        return {
          name: Translate(`web.pages.${page}`),
          description: Translate(`web.pages.${page}.description`),
          open: Translate(`web.pages.${page}.open`),
          path: `/${page}`
        };
      }),
      globalData: { ...this.web.getData(), path: [''] }
    });
  }
}

export default HomeRoute;
