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

async function testConnection() {
  try {
    console.log('Testing production database connection...');

    const client = await pool.connect();
    console.log('✅ Connected to production database successfully!');

    // Test if recipes table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recipes'
      );
    `);

    console.log('Recipes table exists:', tableCheck.rows[0].exists);

    if (tableCheck.rows[0].exists) {
      const tableData = await client.query('SELECT * FROM recipes LIMIT 5');
      console.log('Number of recipes:', tableData.rows.length);
    }

    client.release();
    await pool.end();

  } catch (error) {
    console.error('❌ Connection failed:', error);
    await pool.end();
  }
}

testConnection();