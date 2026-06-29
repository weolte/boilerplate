import { todos } from "@starter/shared/tables";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";

export const selectTodoSchema = createSelectSchema(todos, {
  text: (schema) => schema.default("Buy groceries and fruits"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertTodoSchema = createInsertSchema(todos, {
  text: (schema) => schema.default("Buy groceries and fruits"),
}).omit({
  uuid: true,
  userUuid: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTodoSchema = createUpdateSchema(todos, {
  text: (schema) => schema.default("Buy groceries and fruits"),
}).omit({
  uuid: true,
  userUuid: true,
  createdAt: true,
  updatedAt: true,
});

export type SelectTodoType = z.infer<typeof selectTodoSchema>;
export type InsertTodoType = z.infer<typeof insertTodoSchema>;
export type UpdateTodoType = z.infer<typeof updateTodoSchema>;
