-- Test data for exercising the DB browser / ERD preview features.
-- Adds 5 tables with a mix of 1:many and many:many relations (including
-- one back into the existing `blogs` table) plus seed rows.

CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- many:many between blogs and tags
CREATE TABLE blog_tags (
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_id, tag_id)
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  repo_url TEXT,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1:many off projects
CREATE TABLE project_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- link existing blogs table into the new graph
ALTER TABLE blogs ADD COLUMN author_id UUID REFERENCES authors(id) ON DELETE SET NULL;

-- seed data

INSERT INTO authors (id, name, email, bio) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ada Lovelace', 'ada@example.com', 'Wrote the first algorithm.'),
  ('22222222-2222-2222-2222-222222222222', 'Grace Hopper', 'grace@example.com', 'Compiler pioneer.'),
  ('33333333-3333-3333-3333-333333333333', 'Alan Turing', 'alan@example.com', 'Machines that think.');

INSERT INTO tags (id, name) VALUES
  ('aaaaaaaa-1111-1111-1111-111111111111', 'engineering'),
  ('aaaaaaaa-2222-2222-2222-222222222222', 'design'),
  ('aaaaaaaa-3333-3333-3333-333333333333', 'devops'),
  ('aaaaaaaa-4444-4444-4444-444444444444', 'databases'),
  ('aaaaaaaa-5555-5555-5555-555555555555', 'notes');

INSERT INTO blogs (id, slug, title, content, is_published, author_id) VALUES
  ('bbbbbbbb-1111-1111-1111-111111111111', 'hello-world', 'Hello World', '{"blocks":[]}', true, '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-2222-2222-2222-222222222222', 'shipping-fast', 'Shipping Fast', '{"blocks":[]}', true, '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-3333-3333-3333-333333333333', 'on-migrations', 'On Migrations', '{"blocks":[]}', false, '33333333-3333-3333-3333-333333333333');

INSERT INTO blog_tags (blog_id, tag_id) VALUES
  ('bbbbbbbb-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111111'),
  ('bbbbbbbb-1111-1111-1111-111111111111', 'aaaaaaaa-5555-5555-5555-555555555555'),
  ('bbbbbbbb-2222-2222-2222-222222222222', 'aaaaaaaa-3333-3333-3333-333333333333'),
  ('bbbbbbbb-3333-3333-3333-333333333333', 'aaaaaaaa-4444-4444-4444-444444444444'),
  ('bbbbbbbb-3333-3333-3333-333333333333', 'aaaaaaaa-1111-1111-1111-111111111111');

INSERT INTO projects (id, title, slug, description, repo_url, author_id) VALUES
  ('cccccccc-1111-1111-1111-111111111111', 'ERD Viewer', 'erd-viewer', 'Draggable/pannable/zoomable schema canvas.', 'https://github.com/example/erd-viewer', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-2222-2222-2222-222222222222', 'Deploy Bot', 'deploy-bot', 'Zero-downtime deploy orchestrator.', 'https://github.com/example/deploy-bot', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-3333-3333-3333-333333333333', 'Test Runner', 'test-runner', 'Fast parallel test runner.', 'https://github.com/example/test-runner', NULL);

INSERT INTO project_likes (project_id, session_id) VALUES
  ('cccccccc-1111-1111-1111-111111111111', uuid_generate_v4()),
  ('cccccccc-1111-1111-1111-111111111111', uuid_generate_v4()),
  ('cccccccc-2222-2222-2222-222222222222', uuid_generate_v4()),
  ('cccccccc-3333-3333-3333-333333333333', uuid_generate_v4()),
  ('cccccccc-3333-3333-3333-333333333333', uuid_generate_v4());
