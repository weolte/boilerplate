import { pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./index";

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

export const usersRoles = pgTable(
  "users_roles",
  {
    userUuid: uuid("user_uuid")
      .notNull()
      .references(() => users.uuid),
    roleUuid: uuid("role_uuid")
      .notNull()
      .references(() => roles.uuid),
  },
  (table) => [unique("user_role_unique").on(table.userUuid, table.roleUuid)],
);
