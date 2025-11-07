// TypeScript file

// test-db.ts
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    console.log("Testing database connection...");

    // Test basic connection
    const client = await pool.connect();
    console.log("✅ Database connected successfully");

    // Check if recipes table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'recipes'
      );
    `);

    console.log("Recipes table exists:", tableCheck.rows[0].exists);

    if (tableCheck.rows[0].exists) {
      // Check table structure
      const tableInfo = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'recipes'
        ORDER BY ordinal_position;
      `);
      console.log("Table columns:", tableInfo.rows);

      // Count records
      const count = await client.query("SELECT COUNT(*) FROM recipes");
      console.log("Number of recipes:", count.rows[0].count);
    }

    client.release();
    await pool.end();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    await pool.end();
  }
}

testConnection();
