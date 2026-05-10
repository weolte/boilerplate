import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  uuid: uuid().defaultRandom().primaryKey(),
  username: varchar().notNull().unique(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  verified: boolean().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
