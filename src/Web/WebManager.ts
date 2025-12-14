import Translate from '../Private/Translate.js';
import express, { type Request, type Response } from 'express';
import { ReplaceVariables } from '../Utils/StringUtils.js';
import { readdirSync, statSync } from 'node:fs';
import type Application from '../Application.js';
import type { WebParsedGuildInfo } from '../Types/Web.js';

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

  async connect() {
    this.expressServer.use(express.json());
    this.expressServer.set('view engine', 'ejs');
    this.expressServer.set('views', 'src/Web/Pages');
    this.expressServer.use(express.static('src/Web/Public'));
    this.expressServer.use(express.text());
    await this.loadRoutes();
    this.server = this.expressServer.listen(Number(process.env.DASHBOARD_PORT), () => {
      console.other(ReplaceVariables(Translate('web.server.start'), { port: process.env.DASHBOARD_PORT }));
    });
  }

  disconnect() {
    if (!this.server) {
      console.warn(Translate('web.server.not.running'));
      return;
    }
    this.server.close();
    console.other(Translate('web.server.stop'));
    this.server = undefined;
  }

  async loadRoutes(dir = './src/Web/Routes') {
    const files = readdirSync(dir);
    for (const file of files) {
      if (statSync(`${dir}/${file}`).isDirectory()) {
        await this.loadRoutes(`${dir}/${file}`);
      } else {
        const route = new (await import(`${dir.replaceAll('./src/Web/', './')}/${file}`)).default(this);
        this.expressServer.get(route.path, (req: Request, res: Response) => {
          res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
          res.set('Pragma', 'no-cache');
          res.set('Expires', '0');
          route.get(req, res);
        });

        this.expressServer.post(route.path, (req: Request, res: Response) => {
          route.post(req, res);
        });
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
          discord: Translate('web.pages.title.discord'),
          credits: Translate('web.pages.title.credits'),
          events: Translate('web.pages.title.events'),
          // eslint-disable-next-line camelcase
          member_login: Translate('web.pages.title.member_login')
        }
      }
    };
  }
}

export default WebManager;
