-- 001_create_recipes.sql
CREATE TABLE recipes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  ingredients JSONB NOT NULL, -- array of {name, qty, unit}
  steps JSONB NOT NULL,       -- array of step strings or objects
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_recipes_title ON recipes USING gin (to_tsvector('english', title));
