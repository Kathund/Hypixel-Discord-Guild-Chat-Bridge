import zod from 'zod';
import type Command from '../Discord/Private/Command.js';
import type DiscordManager from '../Discord/DiscordManager.js';
import type { Bot } from 'mineflayer';
import type { Collection } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
  }
}

export type DiscordManagerWithBot = DiscordManager & { Application: { minecraft: { bot: Bot } } };

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
