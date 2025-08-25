import ReplaceVariables from '../Private/ReplaceVariables';
import Translate from '../Private/Translate';
import express, { Request, Response } from 'express';
import { readdirSync, statSync } from 'node:fs';
import type Application from '../Application';
import type { WebParsedGuildInfo } from '../types/Web';

class WebManager {
  readonly Application: Application;
  readonly expressServer: express.Application;
  guildData: WebParsedGuildInfo | null;
  private server?: ReturnType<typeof this.expressServer.listen>;
  constructor(app: Application) {
    this.Application = app;
    this.expressServer = express();
    this.guildData = null;
  }

  async loadServer() {
    this.expressServer.use(express.json());
    this.expressServer.set('view engine', 'ejs');
    this.expressServer.set('views', 'src/Web/Pages');
    this.expressServer.use(express.static('src/Web/Public'));

    await this.loadRoutes();

    this.server = this.expressServer.listen(Number(process.env.DASHBOARD_PORT), () => {
      console.other(ReplaceVariables(Translate('web.server.start'), { port: process.env.DASHBOARD_PORT }));
    });
  }

  stopServer() {
    if (!this.server) {
      console.warn(Translate('web.server.not.running'));
      return;
    }
    this.server.close();
    console.other(Translate('web.server.stop'));
    this.server = undefined;
  }

  async loadRoutes(dir = './src/Web/Routes', basePath = '') {
    const files = readdirSync(dir);

    for (const file of files) {
      if (statSync(`${dir}/${file}`).isDirectory()) {
        await this.loadRoutes(`${dir}/${file}`, `${basePath}/${file}`);
      } else {
        const route = new (await import(`${dir.replaceAll('./src/Web/', './')}/${file}`)).default(this);
        switch (route.type) {
          case 'get': {
            this.expressServer.get(route.path, (req: Request, res: Response) => {
              res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
              res.set('Pragma', 'no-cache');
              res.set('Expires', '0');
              route.handle(req, res);
            });
            break;
          }
          case 'post': {
            this.expressServer.post(route.path, (req: Request, res: Response) => {
              route.handle(req, res);
            });
          }
          default: {
            break;
          }
        }
      }
    }
  }

  getData() {
    return {
      port: process.env.DASHBOARD_PORT,
      guildData: this.guildData,
      strings: {
        changes: Translate('web.changes'),
        changesSave: Translate('web.changes.save'),
        changesDiscard: Translate('web.changes.discard'),
        openPage: Translate('web.pages.open'),
        updateData: Translate('web.pages.header.update.data'),
        title: {
          commands: Translate('web.pages.title.commands'),
          debug: Translate('web.pages.title.debug'),
          misc: Translate('web.pages.title.misc'),
          home: Translate('web.pages.title.home'),
          config: Translate('web.pages.title.config'),
          online: Translate('web.pages.title.online'),
          restart: Translate('web.pages.title.restart'),
          uptime: Translate('web.pages.title.uptime'),
          minecraft: Translate('web.pages.title.minecraft'),
          discord: Translate('web.pages.title.discord')
        }
      }
    };
  }
}

export default WebManager;
