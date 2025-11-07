import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts', // Path to your schema file
  out: './src/db/migrate', // Directory for migration files
  dialect: 'postgresql', // Database driver
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;