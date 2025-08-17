export interface ConfigJSON<T = unknown> {
  type: string;
  defaultValue: T;
  value: T;
}

export type StringConfigJSON = ConfigJSON<string>;
export type BooleanConfigJSON = ConfigJSON<boolean>;
export interface CommandDataJSON {
  enabled: BooleanConfigJSON;
  requiredRole: StringSelectionConfigJSON;
}
export type CommandConfigJSON = ConfigJSON<CommandDataJSON>;
export type ArrayConfigJSON<T> = ConfigJSON<T[]>;

export interface NumberConfigJSON extends ConfigJSON<number> {
  max: number;
  min: number;
}

export interface StringSelectionConfigJSON extends StringConfigJSON {
  options: string[];
}

export interface WebParsedDataBase {
  internal: string;
  name: string;
  description: string;
}

export interface StringSelectionConfigJSONWeb extends StringConfigJSON {
  options: WebParsedDataBase[];
}

export interface WebParsedData extends WebParsedDataBase {
  open: string;
  path: string;
}

export interface WebParsedConfigJSON<T = unknown> extends WebParsedDataBase {
  type: string;
  defaultValue: T;
  value: T;
  options?: T;
}
