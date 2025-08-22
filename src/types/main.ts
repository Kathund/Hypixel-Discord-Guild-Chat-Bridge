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

export type Language = 'en_us';
export type EmbedDefaultColors = 'Green' | 'Red' | 'Blue';
export type Devs = 'kathund' | 'duckysolucky' | 'georgeFilos';
export type DevType = 'maintainer' | 'contributor';
export interface Dev {
  username: string;
  id: string;
  types: DevType[];
  url: string;
}

export interface LogData {
  level: string;
  background: ChalkInstance;
  color: ChalkInstance;
}
