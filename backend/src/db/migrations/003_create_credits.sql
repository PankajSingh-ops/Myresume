CREATE TABLE user_credits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance    INT NOT NULL DEFAULT 0 CHECK (balance >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_user_credits_updated_at
    BEFORE UPDATE
    ON user_credits
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TYPE credit_transaction_type AS ENUM (
  'signup_bonus',
  'resume_create',
  'pdf_export',
  'ai_suggestion',
  'admin_grant',
  'admin_deduct',
  'refund',
  'purchase',
  'ats_scan'
);

CREATE TABLE credit_transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          credit_transaction_type NOT NULL,
  amount        INT NOT NULL,           -- positive = credit, negative = debit
  balance_after INT NOT NULL,           -- balance snapshot after transaction
  description   TEXT,
  metadata      JSONB DEFAULT '{}',     -- { resumeId, exportFormat, etc. }
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
