import zod from 'zod';

export const Language = zod.enum(['en_us', 'tok']);
export type Language = zod.infer<typeof Language>;

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

export interface DataInstance {
  name: string;
  default: Record<string, any> | [];
  schema: zod.ZodType<any>;
}
