export interface WebParsedBaseData {
  name: string;
  id: string;
}

export interface WebParsedRole extends WebParsedBaseData {
  bot: boolean;
}

export interface WebParsedMember extends WebParsedBaseData {
  username: string;
  bot: boolean;
}

export interface WebParsedGuild {
  roles: WebParsedRole[];
  channels: WebParsedBaseData[];
  members: WebParsedMember[];
}

export interface WebParsedGuildInfo {
  data: WebParsedGuild;
  timestamp: number;
}
