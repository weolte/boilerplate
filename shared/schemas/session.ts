import { sessions } from "@starter/shared/tables";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const selectSessionSchema = createSelectSchema(sessions, {
  createdAt: z.date(),
  updatedAt: z.date(),
}).extend({
  expiresIn: z.number(),
});

export type SelectSessionType = z.infer<typeof selectSessionSchema>;
