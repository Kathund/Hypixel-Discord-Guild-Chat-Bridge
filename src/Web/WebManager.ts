import BooleanOption from '../Config/BooleanConfigOption';
import CommandOption, { CommandOptionData } from '../Config/CommandConfigOption';
import ConfigInstance from '../Config/Private/ConfigInstance';
import ConfigOption from '../Config/Private/ConfigOption';
import ReplaceVariables from '../Private/ReplaceVariables';
import StringSelectionOption from '../Config/StringSelectionConfigOption';
import Translate, { getTranslations } from '../Private/Translate';
import express, { Request, Response } from 'express';
import { Language } from '../types/main';
import { WebParsedGuild } from '../types/Web';
import type Application from '../Application';
import type { WebParsedConfigJSON, WebParsedData } from '../types/Configs';

class WebManager {
  private readonly Application: Application;
  private readonly expressServer: express.Application;
  private guildData: WebParsedGuild | null;
  constructor(app: Application) {
    this.Application = app;
    this.expressServer = express();
    this.guildData = null;

    this.expressServer.use(express.json());
    this.expressServer.set('view engine', 'ejs');
    this.expressServer.set('views', 'src/Web/Pages');
    this.expressServer.use(express.static('src/Web/Public'));

    this.expressServer.get('/', (req: Request, res: Response) => {
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
        globalData: { ...this.getData(), path: [''] }
      });
    });

    this.expressServer.get('/config', (req: Request, res: Response) => {
      const configs: WebParsedData[] = [];
      Object.keys(this.Application.config)
        .filter((config) => config !== 'Application')
        .forEach((config) => {
          configs.push({
            internal: config,
            name: Translate(`config.options.${config}`),
            description: Translate(`config.options.${config}.description`),
            open: Translate(`config.options.${config}.open`),
            path: `/config/${config}`
          });
        });
      res.render('config', { configs, globalData: { ...this.getData(), path: req.path.split('/') } });
    });

    this.expressServer.get('/config/:config', (req: Request, res: Response) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      if (['favicon.ico', 'save'].includes(req.params.config)) return;
      const configName = req.params.config as keyof typeof this.Application.config;
      const config = this.Application.config[configName].toJSON();
      if (!config) return res.status(404).send('Config section not found');
      const converted: WebParsedConfigJSON[] = [];
      Object.keys(config).forEach((option) => {
        const convertedData: WebParsedConfigJSON = {
          internal: option,
          name: Translate(`config.options.${configName}.${option}`),
          description: Translate(`config.options.${configName}.${option}.description`),
          ...config[option]
        };
        if (ConfigOption.isStringSelectionConfigJSONWeb(convertedData) && convertedData.internal === 'lang') {
          const options = (convertedData.options as unknown as string[]).map((configOption) => {
            const amount = Math.floor(
              (Object.keys(getTranslations(configOption as Language)).length /
                Object.keys(getTranslations('en_us')).length) *
                100
            );
            return {
              name: ReplaceVariables(
                `${Translate(
                  `config.option.${configName}.${option}.${configOption}`
                )} ${Translate('config.option.misc.lang.amount')}`,
                { amount }
              ),
              description: configOption,
              internal: configOption,
              amount
            };
          });
          convertedData.options = options.sort((a, b) => b.amount - a.amount);
        }
        converted.push(convertedData);
      });
      res.render('configPage', {
        config: converted,
        globalData: { ...this.getData(), path: req.path.split('/') }
      });
    });

    this.expressServer.get('/config/commands/:command', (req: Request, res: Response) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      if (['favicon.ico', 'save'].includes(req.params.command)) return;
      const commandName = req.params.command;
      const command = this.Application.config.commands.getValue(commandName);
      if (!command || command.isCommandOption() === false) return;
      const converted: WebParsedConfigJSON[] = [];
      Object.keys(command.getValue()).forEach((option) => {
        const convertedData: WebParsedConfigJSON = {
          internal: option,
          name: Translate(`config.options.commands.${commandName}.${option}`),
          description: Translate(`config.options.commands.${commandName}.${option}.description`),
          ...(command.getValue() as any)[option]
        };
        converted.push(convertedData);
      });

      res.render('configPage', {
        config: converted,
        globalData: { ...this.getData(), path: req.path.split('/') }
      });
    });

    this.expressServer.post('/config/:config/save', (req, res) => {
      if (['favicon.ico', 'save', 'commands'].includes(req.params.config)) return;
      const configName = req.params.config as keyof typeof this.Application.config;
      const config = this.Application.config[configName];
      if (config === undefined) return;
      const configData = req.body;
      Object.keys(configData).forEach((option) => {
        const value = config.getValue(option);
        if (value === undefined) return;
        const data = value.toJSON();
        data.value = configData[option];
        const fixedData = ConfigInstance.getConfigOption(data);
        if (fixedData !== undefined) {
          config.setValue(option, fixedData);
        }
      });
      config.save();
      res.json({ success: true });
      config.save();
    });

    this.expressServer.post('/config/commands/:command/save', (req, res) => {
      const commandName = req.params.command;
      const command = this.Application.config.commands.getValue(commandName);
      if (!command || command.isCommandOption() === false) return;
      const configData = req.body;
      this.Application.config.commands.setValue(
        commandName,
        new CommandOption(
          new CommandOptionData().setDefault().toJSON(),
          new CommandOptionData()
            .setEnabled(new BooleanOption(configData.enabled ?? true))
            .setRequiredRole(new StringSelectionOption('', [''], configData.requiredRole ?? ''))
            .toJSON()
        )
      );
      this.Application.config.commands.save();
      res.json({ success: true });
      this.Application.config.commands.save();
    });

    this.expressServer.post('/config/:config/force/save', (req, res) => {
      if (['favicon.ico', 'save'].includes(req.params.config)) return;
      const configName = req.params.config as keyof typeof this.Application.config;
      const config = this.Application.config[configName];
      if (config === undefined) return;
      config.save();
    });

    this.expressServer.post('/config/commands/:command/force/save', (req, res) => {
      if (['favicon.ico', 'save'].includes(req.params.command)) return;
      this.Application.config.commands.save();
    });

    this.expressServer.get('/data/discord/server', async (req, res) => {
      try {
        const client = this.Application.discord.client;
        if (client === undefined || !client.isReady()) {
          this.guildData = null;
          return res.send({ success: false, data: null, message: "Client isn't ready" });
        }
        const guild = await client.guilds.fetch(process.env.SERVER_ID);
        if (guild === undefined) {
          this.guildData = null;
          return res.send({ success: false, data: null, message: 'Failed to find guild' });
        }
        const parsedData: WebParsedGuild = {
          roles: [],
          channels: [],
          members: []
        };
        const roles = await guild.roles.fetch();
        roles
          .filter((role) => role.id !== process.env.SERVER_ID)
          .sort((a, b) => b.position - a.position)
          .forEach((role) => parsedData.roles.push({ id: role.id, name: role.name, bot: role.managed }));
        const channels = await guild.channels.fetch();
        channels
          .filter((channel) => channel !== null)
          .forEach((channel) => parsedData.channels.push({ id: channel.id, name: channel.name }));
        const members = await guild.members.fetch();
        members.forEach((member) =>
          parsedData.members.push({
            id: member.user.id,
            name: member.nickname ?? member.user.globalName ?? member.user.username,
            username: member.user.username,
            bot: member.user.bot
          })
        );
        this.guildData = parsedData;
        res.send({ success: true, data: parsedData, message: null });
      } catch (error) {
        console.error(error);
        this.guildData = null;
        return res.send({ success: false, data: null, message: 'I fucked up' });
      }
    });

    this.expressServer.listen(Number(process.env.DASHBOARD_PORT), () => {
      console.other(ReplaceVariables(Translate('web.server.start'), { port: process.env.DASHBOARD_PORT }));
    });
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
          config: Translate('web.pages.title.config')
        }
      }
    };
  }
}

export default WebManager;
