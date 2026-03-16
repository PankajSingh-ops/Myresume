CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

CREATE TABLE transactions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  razorpay_order_id   VARCHAR(255) UNIQUE NOT NULL,
  razorpay_payment_id VARCHAR(255) UNIQUE,
  razorpay_signature  VARCHAR(255),
  amount              INT NOT NULL,
  currency            VARCHAR(10) NOT NULL DEFAULT 'USD',
  credits_added       INT NOT NULL,
  status              transaction_status NOT NULL DEFAULT 'pending',
  plan_id             VARCHAR(50),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE
    ON transactions
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_order_id ON transactions(razorpay_order_id);
