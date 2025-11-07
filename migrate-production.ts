// TypeScript file

import { Pool } from "pg";
import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  console.log('Running production database migration...');

  try {
    // Create the recipes table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        ingredients JSONB NOT NULL,
        steps JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log('✅ Production database migration completed!');

    // Check if table is empty
    const result = await pool.query('SELECT COUNT(*) FROM recipes');
    const count = parseInt(result.rows[0].count);

    console.log(`📊 Database has ${count} recipes`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();