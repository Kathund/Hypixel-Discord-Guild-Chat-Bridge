import Route from '../../../Private/BaseRoute';
import Translate from '../../../../Private/Translate';
import { WebParsedGuild } from '../../../../types/Web';
import type WebManager from '../../../WebManager';
import type { Request, Response } from 'express';

class ServerDataRoute extends Route {
  constructor(web: WebManager) {
    super(web);
    this.path = '/data/discord/server';
  }

  async handle(req: Request, res: Response) {
    try {
      if (req.query.bypass === undefined || Boolean(req.query.bypass) === false) {
        if (this.web.guildData !== null && this.web.guildData.timestamp <= new Date().getTime() + 5 * 60 * 1000) {
          res.status(200).send({ success: true, data: this.web.guildData.data, message: null });
          return;
        }
      }
      const client = this.web.Application.discord.client;
      if (client === undefined || !client.isReady()) {
        this.web.guildData = null;
        res.status(500).send({ success: false, data: null, message: Translate('web.data.discord.error.client') });
        return;
      }
      const guild = await client.guilds.fetch(process.env.SERVER_ID);
      if (guild === undefined) {
        this.web.guildData = null;
        res.status(400).send({ success: false, data: null, message: Translate('web.data.discord.error.guild') });
        return;
      }
      const parsedData: WebParsedGuild = { roles: [], channels: [], members: [] };
      const roles = await guild.roles.fetch();
      roles
        .filter((role) => role.id !== process.env.SERVER_ID)
        .sort((a, b) => b.position - a.position)
        .forEach((role) => parsedData.roles.push({ id: role.id, name: role.name, bot: role.managed }));
      const channels = await guild.channels.fetch();
      channels
        .filter((channel) => channel !== null)
        .forEach((channel) => parsedData.channels.push({ id: channel.id, name: channel.name, type: channel.type }));
      const members = await guild.members.fetch();
      members.forEach((member) =>
        parsedData.members.push({
          id: member.user.id,
          name: member.nickname ?? member.user.globalName ?? member.user.username,
          username: member.user.username,
          bot: member.user.bot
        })
      );
      this.web.guildData = { data: parsedData, timestamp: new Date().getTime() };
      res.status(200).send({ success: true, data: parsedData, message: null });
    } catch (error) {
      console.error(error);
      this.web.guildData = null;
      res.status(500).send({ success: false, data: null, message: Translate('web.data.discord.error') });
    }
  }
}

export default ServerDataRoute;
