import { pgTable, timestamp, uuid, varchar, unique } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./index";

export const devices = pgTable(
  "devices",
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
    unique("user_ip_agent_token_unique").on(
      table.userUuid,
      table.userIp,
      table.userAgent,
      table.userToken,
    ),
  ],
);
