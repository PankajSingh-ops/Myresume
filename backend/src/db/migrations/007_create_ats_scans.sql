CREATE TABLE ats_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scan_type VARCHAR(50) NOT NULL CHECK (scan_type IN ('resume_only', 'job_match')),
    resume_filename VARCHAR(255) NOT NULL,
    resume_text TEXT NOT NULL,
    job_description TEXT,
    result JSONB NOT NULL,
    overall_score INTEGER NOT NULL,
    match_score INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ats_scans_user_id ON ats_scans(user_id);
CREATE INDEX idx_ats_scans_created_at ON ats_scans(created_at);

CREATE TRIGGER update_ats_scans_updated_at
    BEFORE UPDATE
    ON ats_scans
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();