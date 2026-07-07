import { todos } from "@starter/shared/tables";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";
import { v7 as uuidv7 } from "uuid";

export const selectTodoSchema = createSelectSchema(todos, {
  text: (schema) => schema.default("Buy groceries and fruits"),
  createdBy: (schema) => schema.default(uuidv7()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertTodoSchema = createInsertSchema(todos, {
  text: (schema) => schema.default("Buy groceries and fruits"),
}).omit({
  uuid: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTodoSchema = createUpdateSchema(todos, {
  text: (schema) => schema.default("Buy groceries and fruits"),
}).omit({
  uuid: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export type SelectTodoType = z.infer<typeof selectTodoSchema>;
export type InsertTodoType = z.infer<typeof insertTodoSchema>;
export type UpdateTodoType = z.infer<typeof updateTodoSchema>;
