import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./index.js";

export const profiles = pgTable("profiles", {
  uuid: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  userUuid: uuid("user_uuid")
    .references(() => users.uuid)
    .unique(),
  avatar: varchar(),
  fistname: varchar(),
  lastname: varchar(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
