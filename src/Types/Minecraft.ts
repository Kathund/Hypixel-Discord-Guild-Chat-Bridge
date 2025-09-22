import zod from 'zod';
import { TimeLeftData } from './TimeAndDateUtils.js';
import type MinecraftManager from '../Minecraft/MinecraftManager.js';
import type { Bot } from 'mineflayer';

export type MinecraftManagerWithBot = MinecraftManager & { Application: { minecraft: { bot: Bot } } };

export const CommandDataOptionJSON = zod.object({
  name: zod.string().min(1),
  description: zod.string().min(1).nullable(),
  required: zod.boolean()
});
export type CommandDataOptionJSON = zod.infer<typeof CommandDataOptionJSON>;

export const CommandDataJSON = zod.object({
  name: zod.string().min(1),
  description: zod.string().min(1),
  aliases: zod.array(zod.string()),
  options: zod.array(CommandDataOptionJSON)
});
export type CommandDataJSON = zod.infer<typeof CommandDataJSON>;

export const ParsedForgeSlot = zod.object({
  item: zod.string(),
  slot: zod.number(),
  finished: zod.boolean(),
  end: zod.number(),
  timeLeft: TimeLeftData
});
export type ParsedForgeSlot = zod.infer<typeof ParsedForgeSlot>;
