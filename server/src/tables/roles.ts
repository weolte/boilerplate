import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const roles = pgTable("roles", {
  uuid: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  keyword: varchar().notNull().unique(),
  titleUz: varchar().notNull().unique(),
  titleRu: varchar().notNull().unique(),
  titleEn: varchar().notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
