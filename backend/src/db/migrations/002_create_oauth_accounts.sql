CREATE TABLE oauth_accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider            VARCHAR(50) NOT NULL,       -- 'google'
  provider_account_id VARCHAR(255) NOT NULL,
  access_token        TEXT,
  refresh_token       TEXT,
  expires_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

CREATE INDEX idx_oauth_user_id ON oauth_accounts(user_id);
