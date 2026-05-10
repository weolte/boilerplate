import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  uuid: uuid().defaultRandom().primaryKey(),
  keyword: varchar().notNull().unique(),
  titleUz: varchar().notNull().unique(),
  titleRu: varchar().notNull().unique(),
  titleEn: varchar().notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
