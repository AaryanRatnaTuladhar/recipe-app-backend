import { Hono } from 'hono';
import db  from './src/db/db';
import { recipes } from './src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { cors } from 'hono/cors';

const app = new Hono();
console.log("data base url",process.env.DATABASE_URL);
// Enable CORS
app.use('*', cors());

// Get all recipes
app.get('/recipes', async (c) => {
  console.log("getting recipes");

    const allRecipes = await db.select().from(recipes)
    return c.json(allRecipes);
});

// // Get single recipe
// app.get('/recipes/:id', async (c) => {
//   try {
//     const id = parseInt(c.req.param('id'));
//     const recipe = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);

//     if (recipe.length === 0) {
//       return c.json({ error: 'Recipe not found' }, 404);
//     }

//     return c.json(recipe[0]);
//   } catch (error) {
//     console.error('Database error:', error);
//     return c.json({ error: 'Failed to fetch recipe' }, 500);
//   }
// });

// Create recipe
app.post('/recipes', async (c) => {
  try {
    const body = await c.req.json();
    console.log("body",body);
    if (!body.title || !body.ingredients || !body.steps) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const newRecipe = await db.insert(recipes).values({
      title: body.title,
      ingredients: body.ingredients,
      steps: body.steps,
    });

    return c.json(newRecipe[0], 201);

  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Failed to create recipe' }, 500);
  }
});

// Update recipe
app.put('/recipes/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();

  const updatedRecipe = await db.update(recipes)
    .set({
      title: body.title,
      ingredients: body.ingredients,
      steps: body.steps,
    })
    .where(eq(recipes.id, id));

  if (updatedRecipe.length === 0) {
    return c.json({ error: 'Recipe not found' }, 404);
  }

  return c.json(updatedRecipe[0]);
});

// Delete recipe
app.delete(`/recipes/:id`, async (c) => {
  const id = Number(c.req.param('id'));
  console.log('id', id)


  const result = await db.delete(recipes)
    .where(eq(recipes.id, id));
  

    if (result.length === 0) {
      return c.json({ error: 'Recipe not found' }, 404);
    }

  return c.json({ message: 'Recipe deleted successfully' });
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