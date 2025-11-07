// TypeScript file

import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "recipe_app",
});

async function migrate() {
  console.log("Running database migration...");

  try {
    // Create the recipes table
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

    console.log("✅ Database migration completed!");

    // Check if table is empty and add sample data if needed
    const result = await pool.query("SELECT COUNT(*) FROM recipes");
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      console.log("Adding sample recipes...");
      await pool.query(`
        INSERT INTO recipes (title, ingredients, steps) VALUES
        ('Simple Pasta', '["200g spaghetti", "2 cloves garlic, minced", "3 tbsp olive oil", "Salt and pepper to taste", "Fresh parsley, chopped"]', '["Bring large pot of salted water to boil", "Cook spaghetti according to package instructions", "While pasta cooks, heat olive oil in pan", "Sauté garlic until fragrant", "Drain pasta and mix with garlic oil", "Garnish with parsley and serve"]'),
        ('Fresh Garden Salad', '["1 head romaine lettuce", "2 medium tomatoes", "1 cucumber", "1/2 red onion", "1/4 cup olive oil", "2 tbsp lemon juice", "Salt and pepper"]', '["Wash and chop all vegetables", "Slice onion thinly", "Combine olive oil and lemon juice for dressing", "Toss vegetables with dressing", "Season with salt and pepper", "Serve immediately"]');
      `);
      console.log("✅ Sample recipes added!");
    } else {
      console.log(`📊 Database already has ${count} recipes`);
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await pool.end();
  }
}

migrate();
