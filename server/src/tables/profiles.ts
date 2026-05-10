import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./index.js";

export const profiles = pgTable("profiles", {
  uuid: uuid().defaultRandom().primaryKey(),
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
