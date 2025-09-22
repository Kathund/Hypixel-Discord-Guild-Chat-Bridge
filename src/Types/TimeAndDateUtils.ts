import zod from 'zod';

export const TimeLeftData = zod.object({
  seconds: zod.number(),
  minutes: zod.number(),
  hours: zod.number(),
  days: zod.number()
});
export type TimeLeftData = zod.infer<typeof TimeLeftData>;
