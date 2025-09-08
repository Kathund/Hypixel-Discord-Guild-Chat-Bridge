import zod from 'zod';
import { Collection } from 'discord.js';
import type Command from '../Discord/Private/Command';
import type { ChalkInstance } from 'chalk';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
  }
}

declare global {
  export interface Console {
    minecraft: (message: string) => void;
    discord: (message: string) => void;
    other: (message: string) => void;
  }

  export interface String {
    titleCase(): string;
  }
}

export type Language = 'en_us' | 'tok';
export type EmbedDefaultColors = 'Green' | 'Red' | 'Blue';

export interface EmbedData {
  message: string;
  title?: string;
  username?: string;
  color?: EmbedDefaultColors;
}

export const Devs = zod.enum(['kathund', 'duckysolucky', 'georgeFilos', 'zickles', 'madelyn']);
export type Devs = zod.infer<typeof Devs>;

export const DevType = zod.enum(['maintainer', 'contributor', 'translations']);
export type DevType = zod.infer<typeof DevType>;

export const Dev = zod.object({
  username: zod.string(),
  id: zod.string(),
  types: zod.array(DevType),
  url: zod.string()
});
export type Dev = zod.infer<typeof Dev>;

export interface LogData {
  level: string;
  background: ChalkInstance;
  color: ChalkInstance;
}

export interface DataInstance {
  name: string;
  default: Record<string, any> | [];
  schema: zod.ZodType<any>;
}
