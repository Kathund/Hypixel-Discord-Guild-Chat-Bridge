import { ChannelType } from 'discord.js';

export type RouteType = 'get' | 'post';

export interface WebParsedBaseData {
  name: string;
  id: string;
}

export interface WebParsedRole extends WebParsedBaseData {
  bot: boolean;
}

export interface WebParsedChannel extends WebParsedBaseData {
  type: ChannelType;
}

export interface WebParsedMember extends WebParsedBaseData {
  username: string;
  bot: boolean;
}

export interface WebParsedGuild {
  roles: WebParsedRole[];
  channels: WebParsedChannel[];
  members: WebParsedMember[];
}

export interface WebParsedGuildInfo {
  data: WebParsedGuild;
  timestamp: number;
}
