-- Portfolio field notes schema (formerly Supabase-hosted).
-- Access control lives in the app layer now (single trusted app, one admin
-- session) instead of Postgres RLS tied to Supabase's auth schema.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB,
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  anonymous_user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Atomic View Counter
CREATE OR REPLACE FUNCTION increment_view_count(target_slug TEXT)
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blogs
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = target_slug;
END;
$$ LANGUAGE plpgsql;
