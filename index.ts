import { Hono } from "hono";
import { json } from "hono/json";
import recipesRouter from "./routes/recipes";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());
// app.use("*", async (c, next) => {
//   // CORS for local dev
//   c.header("Access-Control-Allow-Origin", "*");
//   c.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (c.req.method === "OPTIONS") return new Response(null, { status: 204 });
//   await next();
// });

app.route("/api/recipes", recipesRouter);

// Add this route to your existing server.ts
app.get("/", (c) => {
  return c.json({ message: "Server is working!" });
});

app.get("/recipes", (c) => {
  return c.json({ message: "Recipes endpoint is working!" });
});

const port = Number(process.env.PORT || 3000);
console.log(`Server running on http://localhost:${port}`);
app.fire();

// For Bun, export like this:
export default {
  port,
  fetch: app.fetch,
};
