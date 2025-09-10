import type DiscordManager from '../Discord/DiscordManager';
import type { Bot } from 'mineflayer';

export type DiscordManagerWithBot = DiscordManager & { Application: { minecraft: { bot: Bot } } };
