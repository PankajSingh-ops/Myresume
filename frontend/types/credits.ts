export interface CreditBalance {
    balance: number;
}

export interface CreditTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'debit' | 'credit';
    action: string;
    description: string;
    resumeId?: string;
    createdAt: string;
}

/** Mirrors backend CREDIT_COSTS */
export const CREDIT_COSTS = {
    RESUME_CREATE: 20,
    COVER_LETTER_CREATE: 20,
    PDF_EXPORT: 5,
    AI_SUGGESTION: 2,
    AI_FULL_REWRITE: 10,
    ATS_SCAN: 10,
} as const;

export const CREDIT_GRANTS = {
    SIGNUP_BONUS: 100,
    REFERRAL_BONUS: 50,
} as const;
