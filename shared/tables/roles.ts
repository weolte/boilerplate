import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const roles = pgTable("roles", {
  uuid: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar().notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
