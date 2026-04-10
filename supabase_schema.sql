-- Supabase Schema for Case #404 Field Notes

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

-- Note: RLS (Row Level Security) Configuration
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published blogs
CREATE POLICY "Public can view published blogs"
ON blogs FOR SELECT
USING (is_published = true);

-- Allow admins to do all on blogs
CREATE POLICY "Admins can do everything"
ON blogs FOR ALL
USING (auth.role() = 'authenticated');

-- Allow public read access to comments
CREATE POLICY "Public can view comments"
ON comments FOR SELECT
USING (true);

-- Allow public to insert comments
CREATE POLICY "Public can insert comments"
ON comments FOR INSERT
WITH CHECK (true);

-- Allow admins to do all on comments
CREATE POLICY "Admins can do everything on comments"
ON comments FOR ALL
USING (auth.role() = 'authenticated');

-- Atomic View Counter RPC
CREATE OR REPLACE FUNCTION increment_view_count(target_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blogs
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = target_slug;
END;
$$ LANGUAGE plpgsql;
