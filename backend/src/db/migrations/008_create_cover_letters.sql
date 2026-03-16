-- Add 'cover_letter_create' to credit_transaction_type ENUM
ALTER TYPE credit_transaction_type ADD VALUE IF NOT EXISTS 'cover_letter_create';

-- Create cover_letters table
CREATE TABLE cover_letters (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title          VARCHAR(255) NOT NULL DEFAULT 'Untitled Cover Letter',
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

CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
CREATE UNIQUE INDEX idx_cover_letters_slug ON cover_letters(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_cover_letters_content_gin ON cover_letters USING GIN (content);

CREATE TRIGGER update_cover_letters_updated_at
    BEFORE UPDATE
    ON cover_letters
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Create cover_letter_versions table
CREATE TABLE cover_letter_versions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cover_letter_id UUID NOT NULL REFERENCES cover_letters(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  content        JSONB NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cover_letter_id, version_number)
);

CREATE INDEX idx_cover_letter_versions_cover_letter_id ON cover_letter_versions(cover_letter_id);
