import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./index";

export const actions = pgTable("actions", {
  uuid: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  userUuid: uuid("user_uuid").references(() => users.uuid),
  object: varchar().notNull(),
  action: varchar().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
