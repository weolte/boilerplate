import { devices } from "@starter/shared/tables";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const selectDeviceSchema = createSelectSchema(devices, {
  createdAt: z.date(),
  updatedAt: z.date(),
}).extend({
  expiresIn: z.number(),
});

export type SelectDeviceType = z.infer<typeof selectDeviceSchema>;
