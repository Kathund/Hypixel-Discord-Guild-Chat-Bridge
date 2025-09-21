import zod from 'zod';

export const ConfigNames = zod.enum(['debug', 'discord', 'minecraft', 'misc']);
export type ConfigNames = zod.infer<typeof ConfigNames>;

export const ConfigJSON = <T extends zod.ZodTypeAny>(inner: T) =>
  zod.object({ type: zod.string(), defaultValue: inner, value: inner });
export type ConfigJSON<T = unknown> = { type: string; defaultValue: T; value: T };

export const ConfigInstanceData = zod.record(zod.string(), ConfigJSON(zod.unknown()));
export type ConfigInstanceData = zod.infer<typeof ConfigInstanceData>;

export const ArrayConfigJSON = <T extends zod.ZodTypeAny>(inner: T) => ConfigJSON(zod.array(inner));
export type ArrayConfigJSON<T> = ConfigJSON<T[]>;

export const BooleanConfigJSON = ConfigJSON(zod.boolean());
export type BooleanConfigJSON = zod.infer<typeof BooleanConfigJSON>;

export const InternalConfigJSON = ConfigJSON(zod.string());
export type InternalConfigJSON = zod.infer<typeof InternalConfigJSON>;

export const NumberConfigJSON = ConfigJSON(zod.number()).extend({ max: zod.number(), min: zod.number() });
export type NumberConfigJSON = zod.infer<typeof NumberConfigJSON>;

export const StringConfigJSON = ConfigJSON(zod.string());
export type StringConfigJSON = zod.infer<typeof StringConfigJSON>;

export const StringSelectionConfigJSON = ConfigJSON(zod.string()).extend({ options: zod.array(zod.string()) });
export type StringSelectionConfigJSON = zod.infer<typeof StringSelectionConfigJSON>;

export const SubConfigConfigJSON = ConfigJSON(ConfigInstanceData);
export type SubConfigConfigJSON = zod.infer<typeof SubConfigConfigJSON>;

export const WebParsedDataBase = zod.object({ internal: zod.string(), name: zod.string(), description: zod.string() });
export type WebParsedDataBase = zod.infer<typeof WebParsedDataBase>;

export const StringSelectionConfigJSONWeb = StringConfigJSON.extend({ options: zod.array(WebParsedDataBase) });
export type StringSelectionConfigJSONWeb = zod.infer<typeof StringSelectionConfigJSONWeb>;

export const WebParsedData = WebParsedDataBase.extend({ open: zod.string(), path: zod.string() });
export type WebParsedData = zod.infer<typeof WebParsedData>;

export const WebParsedConfigJSON = <T extends zod.ZodTypeAny>(inner: T) =>
  WebParsedDataBase.extend({
    type: zod.string(),
    defaultValue: inner,
    value: inner,
    options: inner.optional(),
    open: zod.string().optional(),
    path: zod.string().optional(),
    allowEmpty: zod.boolean().optional()
  });

export type WebParsedConfigJSON<T = unknown> = zod.infer<ReturnType<typeof WebParsedConfigJSON<zod.ZodTypeAny>>> & {
  defaultValue: T;
  value: T;
  options?: T;
};
