export const CREDIT_COSTS = {
    RESUME_CREATE: 20,      // create or duplicate a resume
    COVER_LETTER_CREATE: 20, // create or duplicate a cover letter
    PDF_EXPORT: 5,          // export/download PDF
    AI_SUGGESTION: 2,       // improve bullets, summary, generate bullets, suggest skills
    AI_FULL_REWRITE: 10,    // full section AI rewrite
    ATS_SCAN: 10,           // ATS resume scan or job-match analysis
} as const;

export const CREDIT_GRANTS = {
    SIGNUP_BONUS: 100,      // awarded on registration (email or Google)
    REFERRAL_BONUS: 50,     // future use
} as const;
