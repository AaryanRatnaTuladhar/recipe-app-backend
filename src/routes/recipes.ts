// import { Hono } from "hono";
// import { db } from "../db/drizzle";
// import { recipes } from "../db/schema";
// import { eq, sql, desc } from "drizzle-orm";

// const router = new Hono();

// // Add debug middleware
// router.use("*", async (c, next) => {
//   console.log(`[API] ${c.req.method} ${c.req.path}`);
//   await next();
// });

// router.get("/", async (c) => {
//   try {
//     console.log("[API] GET /api/recipes called");

//     const rows = await db
//       .select()
//       .from(recipes)
//       .orderBy(desc(recipes.created_at));

//     console.log("[API] Found rows:", rows.length);
//     return c.json(rows);
//   } catch (error) {
//     console.error("[API] Error in GET /:", error);
//     return c.json({ error: "Database error" }, 500);
//   }
// });

// router.get("/:id", async (c) => {
//   try {
//     const id = Number(c.req.param("id"));
//     const row = await db
//       .select()
//       .from(recipes)
//       .where(eq(recipes.id, id))
//       .limit(1);

//     if (!row || row.length === 0) return c.json({ error: "Not found" }, 404);
//     return c.json(row[0]);
//   } catch (error) {
//     console.error("[API] Error in GET /:id:", error);
//     return c.json({ error: "Database error" }, 500);
//   }
// });

// router.post("/", async (c) => {
//   try {
//     const payload = await c.req.json();

//     // Simple validation
//     if (!payload.title || !payload.ingredients || !payload.steps) {
//       return c.json({ error: "Missing required fields" }, 400);
//     }

//     const insert = await db
//       .insert(recipes)
//       .values({
//         title: payload.title,
//         ingredients: payload.ingredients,
//         steps: payload.steps,
//       })
//       .returning();

//     return c.json(insert[0], 201);
//   } catch (error) {
//     console.error("[API] Error in POST /:", error);
//     return c.json({ error: "Database error" }, 500);
//   }
// });

// router.put("/:id", async (c) => {
//   try {
//     const id = Number(c.req.param("id"));
//     const body = await c.req.json();

//     const upd = await db
//       .update(recipes)
//       .set({
//         title: body.title,
//         ingredients: body.ingredients,
//         steps: body.steps,
//         updated_at: new Date(),
//       })
//       .where(eq(recipes.id, id))
//       .returning();

//     return c.json(upd[0] ?? { error: "Not found" }, upd.length ? 200 : 404);
//   } catch (error) {
//     console.error("[API] Error in PUT /:id:", error);
//     return c.json({ error: "Database error" }, 500);
//   }
// });

// router.delete("/:id", async (c) => {
//   try {
//     const id = Number(c.req.param("id"));
//     await db.delete(recipes).where(eq(recipes.id, id));
//     return c.text("", 204);
//   } catch (error) {
//     console.error("[API] Error in DELETE /:id:", error);
//     return c.json({ error: "Database error" }, 500);
//   }
// });

// // Test endpoint
// router.get("/test", (c) => {
//   return c.json({ message: "Recipes router is working!" });
// });

// export default router;
