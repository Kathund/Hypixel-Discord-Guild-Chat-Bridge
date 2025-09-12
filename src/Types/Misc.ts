import type { ChalkInstance } from 'chalk';

declare global {
  export interface Console {
    minecraft: (message: string) => void;
    discord: (message: string) => void;
    other: (message: string) => void;
  }
}

export interface LogData {
  level: string;
  background: ChalkInstance;
  color: ChalkInstance;
}
