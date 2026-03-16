CREATE TABLE resume_versions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id      UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  content        JSONB NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(resume_id, version_number)
);

CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id);
