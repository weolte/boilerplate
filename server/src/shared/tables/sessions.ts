import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./users.js";

export const sessions = pgTable(
  "sessions",
  {
    uuid: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    userUuid: uuid("user_uuid")
      .references(() => users.uuid)
      .notNull(),
    userIp: varchar("user_ip").notNull(),
    userAgent: varchar("user_agent").notNull(),
    userToken: varchar("user_token").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("user_session_unique").on(
      table.userUuid,
      table.userIp,
      table.userAgent,
    ),
  ],
);
