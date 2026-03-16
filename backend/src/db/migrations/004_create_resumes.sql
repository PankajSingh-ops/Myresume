CREATE TABLE resumes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title          VARCHAR(255) NOT NULL DEFAULT 'Untitled Resume',
  slug           VARCHAR(255) UNIQUE,
  template_id    VARCHAR(100) NOT NULL DEFAULT 'classic',
  content        JSONB NOT NULL DEFAULT '{}',
  settings       JSONB NOT NULL DEFAULT '{}',
  is_public      BOOLEAN NOT NULL DEFAULT false,
  thumbnail_url  TEXT,
  last_edited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE UNIQUE INDEX idx_resumes_slug ON resumes(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_resumes_content_gin ON resumes USING GIN (content);

CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE
    ON resumes
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
