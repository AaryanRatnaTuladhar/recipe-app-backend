import { Hono } from 'hono';
import { db, recipes } from './db';
import { eq, desc } from 'drizzle-orm';

const app = new Hono();

// Enable CORS
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type');
  if (c.req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }
  await next();
});

// Get all recipes
app.get('/recipes', async (c) => {
  try {
    const allRecipes = await db.select().from(recipes).orderBy(desc(recipes.created_at));
    return c.json(allRecipes);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Failed to fetch recipes' }, 500);
  }
});

// Get single recipe
app.get('/recipes/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const recipe = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);

    if (recipe.length === 0) {
      return c.json({ error: 'Recipe not found' }, 404);
    }

    return c.json(recipe[0]);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Failed to fetch recipe' }, 500);
  }
});

// Create recipe
app.post('/recipes', async (c) => {
  try {
    const body = await c.req.json();

    if (!body.title || !body.ingredients || !body.steps) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const newRecipe = await db.insert(recipes).values({
      title: body.title,
      ingredients: body.ingredients,
      steps: body.steps,
    }).returning();

    return c.json(newRecipe[0], 201);

  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Failed to create recipe' }, 500);
  }
});

// Update recipe
app.put('/recipes/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();

    const updatedRecipe = await db.update(recipes)
      .set({
        title: body.title,
        ingredients: body.ingredients,
        steps: body.steps,
        updated_at: new Date()
      })
      .where(eq(recipes.id, id))
      .returning();

    if (updatedRecipe.length === 0) {
      return c.json({ error: 'Recipe not found' }, 404);
    }

    return c.json(updatedRecipe[0]);

  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Failed to update recipe' }, 500);
  }
});

// Delete recipe
app.delete('/recipes/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));

    const deletedRecipe = await db.delete(recipes)
      .where(eq(recipes.id, id))
      .returning();

    if (deletedRecipe.length === 0) {
      return c.json({ error: 'Recipe not found' }, 404);
    }

    return c.json({ message: 'Recipe deleted successfully' });

  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Failed to delete recipe' }, 500);
  }
});

// Test route
app.get('/', (c) => {
  return c.json({ message: 'Recipe API is running with PostgreSQL!' });
});

const port = 3000;
console.log(`🚀 Server running on http://localhost:${port}`);
console.log(`📊 Using PostgreSQL database`);

export default {
  port,
  fetch: app.fetch,
};