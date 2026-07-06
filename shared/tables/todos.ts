import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./users";

export const todos = pgTable("todos", {
  uuid: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  text: varchar().notNull(),
  createdBy: uuid("created_by").references(() => users.uuid),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
