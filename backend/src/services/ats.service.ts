import OpenAI from 'openai';
import { config } from '../config';
import pool, { query } from '../db/pool';
import { logger } from '../lib/logger';
import { AppError } from '../modules/credits/errors';
import { CreditsService } from '../modules/credits/service';
import { CREDIT_COSTS } from '../modules/credits/constants';
import {
    ATS_SCAN_SYSTEM_PROMPT,
    buildATSScanUserPrompt
} from '../prompts/atsScan.prompt';
import {
    ATS_JOB_MATCH_SYSTEM_PROMPT,
    buildATSJobMatchUserPrompt
} from '../prompts/atsJobMatch.prompt';

// ─── OpenAI Client ───────────────────────────────────────────
const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
    timeout: 60000, // 60 s – ATS analysis can be lengthy
});

// ─── Result Interfaces ───────────────────────────────────────

export interface ATSScanResult {
    overall_score: number;
    grade: string;
    summary: string;
    category_scores: Record<string, { score: number; label: string; feedback: string }>;
    sections_detected: Record<string, boolean>;
    strengths: string[];
    improvements: { issue: string; description: string; suggestion: string }[];
    keywords_found: string[];
    missing_keywords: string[];
    ats_tips: string[];
}

export interface ATSJobMatchResult {
    match_score: number;
    match_label: string;
    hiring_likelihood: string;
    executive_summary: string;
    keyword_analysis: {
        matched_keywords: { keyword: string; importance: string; found_in: string[] }[];
        missing_keywords: { keyword: string; importance: string; context: string }[];
        match_percentage: number;
    };
    skills_analysis: {
        matched_skills: string[];
        missing_required_skills: string[];
        missing_preferred_skills: string[];
        bonus_skills: string[];
    };
    experience_analysis: {
        years_required: number | string;
        years_candidate_has: number | string;
        experience_match: boolean;
        relevant_experience_summary: string;
        experience_gaps: string[];
    };
    education_analysis: {
        required: string;
        candidate_has: string;
        education_match: boolean;
    };
    positives: { title: string; description: string }[];
    negatives: { title: string; severity: string; description: string; how_to_address: string }[];
    resume_tailoring_suggestions: { section: string; current_issue: string; suggested_action: string }[];
    interview_talking_points: string[];
    overall_recommendation: string;
}

export interface ATSScan {
    id: string;
    user_id: string;
    scan_type: 'resume_only' | 'job_match';
    resume_filename: string;
    resume_text: string;
    job_description: string | null;
    result: ATSScanResult | ATSJobMatchResult;
    overall_score: number;
    match_score: number | null;
    created_at: string;
    updated_at: string;
}

// ─── Service ─────────────────────────────────────────────────

export class ATSService {
    // ── Resume-only scan ─────────────────────────────────────

    public async scanResume(
        userId: string,
        resumeText: string,
        filename: string
    ): Promise<{ scanId: string; result: ATSScanResult; credits: { deducted: number; newBalance: number } }> {
        logger.info({ message: 'Starting ATS resume scan', userId, filename });

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Deduct credits
            const newBalance = await CreditsService.deductCredits(
                userId,
                CREDIT_COSTS.ATS_SCAN,
                'ats_scan',
                `ATS resume scan: "${filename}"`,
                {},
                client
            );

            // 2. Call OpenAI
            const systemPrompt = ATS_SCAN_SYSTEM_PROMPT;
            const userPrompt = buildATSScanUserPrompt(resumeText);

            const parsed = await this.callOpenAI<ATSScanResult>(
                systemPrompt,
                userPrompt,
                userId,
                'ats_resume_scan'
            );

            // 3. Persist to DB
            const insertResult = await client.query(
                `INSERT INTO ats_scans
                    (user_id, scan_type, resume_filename, resume_text, result, overall_score)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                [
                    userId,
                    'resume_only',
                    filename,
                    resumeText,
                    JSON.stringify(parsed),
                    parsed.overall_score,
                ]
            );

            const scanId: string = insertResult.rows[0].id;

            await client.query('COMMIT');

            logger.info({
                message: 'ATS resume scan completed',
                userId,
                filename,
                scanId,
                overall_score: parsed.overall_score,
            });

            return { scanId, result: parsed, credits: { deducted: CREDIT_COSTS.ATS_SCAN, newBalance } };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // ── Job-match scan ───────────────────────────────────────

    public async matchJobDescription(
        userId: string,
        resumeText: string,
        jobDescription: string,
        filename: string
    ): Promise<{ scanId: string; result: ATSJobMatchResult; credits: { deducted: number; newBalance: number } }> {
        logger.info({ message: 'Starting ATS job-match scan', userId, filename });

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Deduct credits
            const newBalance = await CreditsService.deductCredits(
                userId,
                CREDIT_COSTS.ATS_SCAN,
                'ats_scan',
                `ATS job-match scan: "${filename}"`,
                {},
                client
            );

            // 2. Call OpenAI
            const systemPrompt = ATS_JOB_MATCH_SYSTEM_PROMPT;
            const userPrompt = buildATSJobMatchUserPrompt(resumeText, jobDescription);

            const parsed = await this.callOpenAI<ATSJobMatchResult>(
                systemPrompt,
                userPrompt,
                userId,
                'ats_job_match'
            );

            // 3. Persist to DB
            const insertResult = await client.query(
                `INSERT INTO ats_scans
                    (user_id, scan_type, resume_filename, resume_text, job_description, result, overall_score, match_score)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING id`,
                [
                    userId,
                    'job_match',
                    filename,
                    resumeText,
                    jobDescription,
                    JSON.stringify(parsed),
                    parsed.match_score,
                    parsed.match_score,
                ]
            );

            const scanId: string = insertResult.rows[0].id;

            await client.query('COMMIT');

            logger.info({
                message: 'ATS job-match scan completed',
                userId,
                filename,
                scanId,
                match_score: parsed.match_score,
            });

            return { scanId, result: parsed, credits: { deducted: CREDIT_COSTS.ATS_SCAN, newBalance } };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // ── Get paginated scans for user ─────────────────────────

    public async getUserScans(
        userId: string,
        page: number,
        limit: number
    ): Promise<{ scans: ATSScan[]; total: number }> {
        logger.info({ message: 'Fetching user ATS scans', userId, page, limit });

        const offset = (page - 1) * limit;

        const [countResult, dataResult] = await Promise.all([
            query(
                `SELECT COUNT(*)::int AS total FROM ats_scans WHERE user_id = $1`,
                [userId]
            ),
            query(
                `SELECT * FROM ats_scans
                 WHERE user_id = $1
                 ORDER BY created_at DESC
                 LIMIT $2 OFFSET $3`,
                [userId, limit, offset]
            ),
        ]);

        const total: number = countResult.rows[0]?.total ?? 0;
        const scans: ATSScan[] = dataResult.rows;

        return { scans, total };
    }

    // ── Get single scan by ID ────────────────────────────────

    public async getScanById(scanId: string, userId: string): Promise<ATSScan> {
        logger.info({ message: 'Fetching ATS scan by ID', scanId, userId });

        const result = await query(
            `SELECT * FROM ats_scans WHERE id = $1`,
            [scanId]
        );

        if (result.rows.length === 0) {
            throw new AppError(404, 'SCAN_NOT_FOUND', 'ATS scan not found.');
        }

        const scan: ATSScan = result.rows[0];

        if (scan.user_id !== userId) {
            throw new AppError(403, 'FORBIDDEN', 'You do not have access to this scan.');
        }

        return scan;
    }

    // ─── Private helpers ─────────────────────────────────────

    /**
     * Calls OpenAI chat completions with JSON response format.
     * Retries once if the response is not valid JSON.
     */
    private async callOpenAI<T>(
        systemPrompt: string,
        userPrompt: string,
        userId: string,
        actionName: string
    ): Promise<T> {
        const maxAttempts = 2; // initial + 1 retry

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const startTime = Date.now();

            try {
                const completion = await openai.chat.completions.create({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt },
                    ],
                    max_tokens: 4000,
                    temperature: 0.3,
                    response_format: { type: 'json_object' },
                });

                const duration = Date.now() - startTime;
                logger.info({
                    message: `OpenAI call completed`,
                    userId,
                    actionName,
                    attempt,
                    duration: `${duration}ms`,
                });

                const raw = completion.choices[0]?.message?.content;
                if (!raw) {
                    throw new AppError(
                        503,
                        'AI_SERVICE_ERROR',
                        'Received empty response from AI service.'
                    );
                }

                // Parse & validate JSON
                try {
                    const parsed: T = JSON.parse(raw);
                    return parsed;
                } catch {
                    if (attempt < maxAttempts) {
                        logger.warn({
                            message: 'OpenAI returned invalid JSON, retrying...',
                            userId,
                            actionName,
                            attempt,
                        });
                        continue; // retry
                    }
                    throw new AppError(
                        503,
                        'AI_INVALID_RESPONSE',
                        'AI service returned an invalid response format.'
                    );
                }
            } catch (error: any) {
                // Re-throw our own AppErrors immediately
                if (error instanceof AppError) {
                    throw error;
                }

                const duration = Date.now() - startTime;

                // Handle OpenAI rate limits – retry once
                if (error instanceof OpenAI.APIError && error.status === 429 && attempt < maxAttempts) {
                    logger.warn({
                        message: 'OpenAI rate limit hit, retrying after 2 s...',
                        userId,
                        actionName,
                        attempt,
                    });
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    continue;
                }

                logger.error({
                    message: `OpenAI call failed`,
                    userId,
                    actionName,
                    attempt,
                    duration: `${duration}ms`,
                    error: error.message,
                });

                if (
                    error.name === 'APITimeoutError' ||
                    error.code === 'ECONNABORTED' ||
                    (error.message && error.message.includes('timeout'))
                ) {
                    throw new AppError(
                        504,
                        'AI_TIMEOUT',
                        'The AI service took too long to respond. Please try again later.'
                    );
                }

                throw new AppError(
                    503,
                    'AI_SERVICE_ERROR',
                    'The AI service is temporarily unavailable.'
                );
            }
        }

        throw new AppError(
            503,
            'AI_SERVICE_ERROR',
            'The AI service is temporarily unavailable after retries.'
        );
    }
}

export const atsService = new ATSService();
