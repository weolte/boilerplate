import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  uuid: uuid().defaultRandom().primaryKey(),
  text: varchar().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
