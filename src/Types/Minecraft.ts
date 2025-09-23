import zod from 'zod';
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
  timeLeft: zod.string()
});
export type ParsedForgeSlot = zod.infer<typeof ParsedForgeSlot>;

export type Floors =
  | 'highestFloorCompleted'
  | 'floor0'
  | 'floor1'
  | 'floor2'
  | 'floor3'
  | 'floor4'
  | 'floor5'
  | 'floor6'
  | 'floor7';

export interface FloorData {
  id: string;
  timesPlayed: number;
  fastestTimeS: number;
  fastestTimeSPlus: number;
}
