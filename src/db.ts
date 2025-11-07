// TypeScript file

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { recipes } from "./schema";

// Database connection - update with your PostgreSQL credentials
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "user",
  password: "test1234",
  database: "recipes",
});
/*
  host: "${ host:: production - db }",
  DB_HOST = ${ host:: production - db }
DB_TYPE = postgresql
POSTGRES_USER = user
POSTGRES_PASSWORD = test1234
POSTGRES_DB = recipeData
*/
export const db = drizzle(pool);
export { recipes };
