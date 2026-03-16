CREATE TABLE resume_analytics (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id   UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resume_analytics_resume_id ON resume_analytics(resume_id);

CREATE TABLE cover_letter_analytics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cover_letter_id UUID NOT NULL REFERENCES cover_letters(id) ON DELETE CASCADE,
  ip_address      VARCHAR(45),
  user_agent      TEXT,
  viewed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cover_letter_analytics_cover_letter_id ON cover_letter_analytics(cover_letter_id);
