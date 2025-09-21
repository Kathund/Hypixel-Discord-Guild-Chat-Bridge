import zod from 'zod';
import type Command from '../Discord/Private/Command.js';
import type DiscordManager from '../Discord/DiscordManager.js';
import type { Bot } from 'mineflayer';
import type { Client, Collection } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    scripts: Collection<string, NodeJS.Timeout>;
  }
}

export type DiscordManagerWithClient = DiscordManager & { client: Client };
export type DiscordManagerWithBot = DiscordManagerWithClient & { Application: { minecraft: { bot: Bot } } };

export const EmbedDefaultColor = zod.string().length(7).startsWith('#').lowercase();
export type EmbedDefaultColor = zod.infer<typeof EmbedDefaultColor>;
export const EmbedDefaultColors = zod.enum(['Green', 'Red', 'Blue']);
export type EmbedDefaultColors = zod.infer<typeof EmbedDefaultColors>;

export const EmbedData = zod.object({
  message: zod.string(),
  title: zod.string().optional(),
  username: zod.string().optional(),
  color: EmbedDefaultColors.optional()
});
export type EmbedData = zod.infer<typeof EmbedData>;

export const OnlineMembersGroup = zod.object({ name: zod.string(), value: zod.string() });
export type OnlineMembersGroup = zod.infer<typeof OnlineMembersGroup>;

export const OnlineMembers = zod.object({
  online: zod.number(),
  onlineString: zod.string(),
  total: zod.number(),
  totalString: zod.string(),
  groups: zod.array(OnlineMembersGroup)
});
export type OnlineMembers = zod.infer<typeof OnlineMembers>;

export const ScriptDataJSON = zod.object({ name: zod.string().min(1) });
export type ScriptDataJSON = zod.infer<typeof ScriptDataJSON>;
