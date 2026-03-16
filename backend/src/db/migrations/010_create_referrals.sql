-- Add referral columns to users table
ALTER TABLE users
  ADD COLUMN referral_code         VARCHAR(20) UNIQUE,
  ADD COLUMN referred_by_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN referral_code_used_at TIMESTAMPTZ;

CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by_user_id);

-- Add referral transaction types to existing enum
ALTER TYPE credit_transaction_type ADD VALUE IF NOT EXISTS 'referral_bonus';
ALTER TYPE credit_transaction_type ADD VALUE IF NOT EXISTS 'referee_bonus';

-- Create referral status enum
CREATE TYPE referral_status AS ENUM ('pending', 'rewarded', 'expired');

-- Create referrals table
CREATE TABLE referrals (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referee_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status           referral_status NOT NULL DEFAULT 'pending',
  referrer_credits INT NOT NULL DEFAULT 100,
  referee_credits  INT NOT NULL DEFAULT 50,
  rewarded_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(referee_id)
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_status ON referrals(status);
