// TypeScript file

import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";

export const recipes = pgTable("recipes", {
  id: serial("id", {mode: "number"}).primaryKey().notNull(),
  title: text("title").notNull(),
  ingredients: jsonb("ingredients").$type<unknown>().notNull(),
  steps: jsonb("steps").$type<unknown>().notNull()
});

export const user = pgTable("user", {
  id: serial("id", {mode: "number"}).primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;