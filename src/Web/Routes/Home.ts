import Route from '../Private/BaseRoute';
import Translate from '../../Private/Translate';
import type WebManager from '../WebManager';
import type { Request, Response } from 'express';

class HomeRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/';
  }

  handle(req: Request, res: Response) {
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
