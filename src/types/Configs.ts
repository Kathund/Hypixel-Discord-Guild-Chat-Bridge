export interface ConfigJSON<T = unknown> {
  type: string;
  defaultValue: T;
  value: T;
}

export type StringConfigJSON = ConfigJSON<string>;
export type BooleanConfigJSON = ConfigJSON<boolean>;
export interface CommandDataJSON {
  enabled: boolean;
}
export type CommandConfigJSON = ConfigJSON<CommandDataJSON>;
export type ArrayConfigJSON<T> = ConfigJSON<T[]>;

export interface NumberConfigJSON extends ConfigJSON<number> {
  max: number;
  min: number;
}
