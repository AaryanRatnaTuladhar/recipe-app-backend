import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { recipes } from "./schema";

// Use environment variables for database connection
const pool = new Pool({
  host: process.env.DB_HOST || "production-db", // This will use your ${host::production-db}
  port: 5432,
  user: process.env.POSTGRES_USER || "user",
  password: process.env.POSTGRES_PASSWORD || "test1234",
  database: process.env.POSTGRES_DB || "recipe",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

console.log('Database config:', {
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool);
export { recipes };