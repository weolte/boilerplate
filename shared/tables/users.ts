import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const users = pgTable("users", {
  uuid: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  username: varchar().notNull().unique(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  verified: boolean().default(false),
  roles: varchar().array().default(["user"]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
