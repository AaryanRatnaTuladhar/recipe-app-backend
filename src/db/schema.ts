// TypeScript file

import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: serial("id", {mode: "number"}).primaryKey().notNull(),
  title: text("title").notNull(),
  ingredients: jsonb("ingredients").$type<unknown>().notNull(),
  steps: jsonb("steps").$type<unknown>().notNull()
});