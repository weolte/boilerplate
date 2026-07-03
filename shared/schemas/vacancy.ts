import { vacancies } from "@starter/shared/tables";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";

export const selectVacancySchema = createSelectSchema(vacancies, {
  name: (schema) => schema.default("Developer"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertVacancySchema = createInsertSchema(vacancies, {
  name: (schema) => schema.default("Developer"),
}).omit({
  uuid: true,
  createdAt: true,
  updatedAt: true,
});

export const updateVacancySchema = createUpdateSchema(vacancies, {
  name: (schema) => schema.default("Developer"),
}).omit({
  uuid: true,
  createdAt: true,
  updatedAt: true,
});

export type SelectVacancyType = z.infer<typeof selectVacancySchema>;
export type InsertVacancyType = z.infer<typeof insertVacancySchema>;
export type UpdateVacancyType = z.infer<typeof updateVacancySchema>;
