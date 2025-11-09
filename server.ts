import { Hono } from 'hono';
import db  from './src/db/db';
import { recipes } from './src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { signupValidator } from './src/schema/signupSchema';
import { generateToken, cookieOpts } from './helpers';
import { setCookie } from 'hono/cookie';

const app = new Hono();
console.log("data base url", process.env.DATABASE_URL);

// Enable CORS
app.use('/*', cors({
  origin: 'https://recipe-app-frontend-a8qe18fhvcjr6jevvawr8aad-5173.thekalkicinematicuniverse.com',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}
));

// JWT longGeneric
app.post('/signup', signupValidator, async (c) => {

  // validate the userinput 
  const { email, password } = c.req.valid('json');
  // insert the user into the database
  try {
    const user = await db.insert(user).values({
      email,
      password,
    }).returning();

    // generate a jwt token
    const token = await generateToken(userId);

    // put the JWT into hte cookie
    setCookie(c, 'authToken', token, cookieOpts)

    //send success Response
    return c.json({
      message: 'User created successfully',
      user: { id: userId, email }
    }, 201);

  } catch (error) {
    // send an erro message
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return c.json({ errors: "Email already exists" }, 409)
    }
    console.error('signup error, ', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
})
  .post('/login', signupValidator, async (c) => {
    // validate the user input
    const { email, password } = c.req.valid('json');

    try {
      // cuery user by email
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (!user) {
        return c.json({ error: 'Invalid email or password' }, 401);
      }
      //verify pasword matches 
      const passwordMatch = await Bun.password.verify(password, user.password);

      if (!passwordMatch) {
        return c.json({ error: 'Invalid email or password' }, 401);
      }

      // generate a jwt token
      const token = await generateToken(user.id);

      // put the JWT into hte cookie
      setCookie(c, 'authToken', token, cookieOpts)

      return c.json({
        message: 'Login successful',
        user: { id: user.id, email: email },
      });
    } catch (error) {
      console.error('Login error:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })
  .post('logout', async (c) => {
    deleteCookie(c, 'authToken', {
      path: '/',
      secure: process.env.NODE_ENV,
      httpOnly: true,
      sameSite: 'lax',
      httpOnly: true
    })
    return c.json({ message: 'Logout successful' });
  })

// Get all recipes
app.get('/recipes', async (c) => {
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
    .where(eq(recipes.id, id))
    .returning();

  if (updatedRecipe.length === 0) {
    return c.json({ error: 'Recipe not found' }, 404);
  }

  return c.json(updatedRecipe[0]);
});

// Delete recipe
app.delete(`/recipes/:id`, async (c) => {
  const id = Number(c.req.param('id'));

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