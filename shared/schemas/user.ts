import { users } from "@starter/shared/tables";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";

export const selectUserSchema = createSelectSchema(users, {
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[a-z]/, "At least one lowercase letter")
    .regex(/[0-9]/, "At least one digit")
    .regex(/[^A-Za-z0-9]/, "At least one special character"),
}).omit({
  uuid: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createUpdateSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export type SelectUserType = z.infer<typeof selectUserSchema>;
export type InsertUserType = z.infer<typeof insertUserSchema>;
export type UpdateUserType = z.infer<typeof updateUserSchema>;
