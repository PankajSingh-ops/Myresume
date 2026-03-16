CREATE TABLE users (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                       VARCHAR(255) UNIQUE NOT NULL,
  password_hash               VARCHAR(255),           -- NULL for OAuth-only users
  first_name                  VARCHAR(100) NOT NULL,
  last_name                   VARCHAR(100) NOT NULL,
  avatar_url                  TEXT,
  role                        VARCHAR(20) NOT NULL DEFAULT 'user', -- user | admin
  is_email_verified           BOOLEAN NOT NULL DEFAULT false,
  email_verification_token    VARCHAR(255),
  email_verification_expires  TIMESTAMPTZ,
  password_reset_token        VARCHAR(255),
  password_reset_expires      TIMESTAMPTZ,
  failed_login_attempts       INT NOT NULL DEFAULT 0,
  locked_until                TIMESTAMPTZ,
  last_login_at               TIMESTAMPTZ,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Trigger function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE
    ON users
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
