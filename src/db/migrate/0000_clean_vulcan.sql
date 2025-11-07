CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"ingredients" jsonb NOT NULL,
	"steps" jsonb NOT NULL
);
