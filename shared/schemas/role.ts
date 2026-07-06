import { roles } from "@starter/shared/tables";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";

export const selectRoleSchema = createSelectSchema(roles, {
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertRoleSchema = createInsertSchema(roles, {}).omit({
  uuid: true,
  createdAt: true,
  updatedAt: true,
});

export const updateRoleSchema = createUpdateSchema(roles).omit({
  createdAt: true,
  updatedAt: true,
});

export type SelectRoleType = z.infer<typeof selectRoleSchema>;
export type InsertRoleType = z.infer<typeof insertRoleSchema>;
export type UpdateRoleType = z.infer<typeof updateRoleSchema>;
