import { callOpenAIWithRetry } from './openai';
import { CreditsService } from '../credits/service';
import { CREDIT_COSTS } from '../credits/constants';
import { AppError } from '../credits/errors';
import {
    ImproveBulletsDTO,
    ImproveSummaryDTO,
    ImproveCoverLetterDTO,
    GenerateBulletsDTO,
    SuggestSkillsDTO,
    RewriteSectionDTO
} from './schemas';

/**
 * Standard processing loop for the AI module.
 * 1. Fast fail on insufficient credits to save compute and API calls
 * 2. Connect to the OpenAI SDK wrapper processing failures identically
 * 3. Validate parsed output
 * 4. Deduct credits *ONLY* after it succeeded
 */
async function processAIRequest(
    userId: string,
    systemPrompt: string,
    userPrompt: string,
    actionName: string,
    cost: number
): Promise<{ result: any, credits: { deducted: number, newBalance: number } }> {
    // 1. Pre-flight check
    const check = await CreditsService.checkSufficientCredits(userId, cost);
    if (!check.sufficient) {
        throw new AppError(402, 'INSUFFICIENT_CREDITS', `You need ${check.required} credits but only have ${check.balance}.`);
    }

    // 2. Network connection to OpenAI
    const rawResult = await callOpenAIWithRetry(systemPrompt, userPrompt, userId, actionName, cost);

    // 3. Parsing Validation (as prompt specified `json_object` format)
    let parsedResult;
    try {
        parsedResult = JSON.parse(rawResult);
    } catch (err) {
        throw new AppError(500, 'AI_PARSE_ERROR', 'Failed to parse AI response as JSON.');
    }

    // 4. Atomic Deduct (only runs after API and JSON parse succeeds)
    const newBalance = await CreditsService.deductCredits(
        userId,
        cost,
        'ai_suggestion',
        `AI generated content: ${actionName}`,
        { actionName }
    );

    return {
        result: parsedResult,
        credits: { deducted: cost, newBalance }
    };
}

export const AIService = {
    async improveBullets(userId: string, data: ImproveBulletsDTO) {
        const systemPrompt = "You are an expert resume writer. Improve these bullet points using STAR format and strong action verbs. Return ONLY a valid JSON array of improved bullet strings, no commentary. Example: { \"bullets\": [\"string 1\", \"string 2\"] }";

        const numberedBullets = data.bullets.map((b, i) => `${i + 1}. ${b}`).join('\n');
        const userPrompt = `Role: ${data.role}\nIndustry: ${data.industry || 'general'}\nBullets:\n${numberedBullets}`;

        const response = await processAIRequest(userId, systemPrompt, userPrompt, 'improve_bullets', CREDIT_COSTS.AI_SUGGESTION);

        // Standardize output shape
        if (!response.result.bullets || !Array.isArray(response.result.bullets)) {
            // Failsafe format mapping if OpenAI returns an Array organically outside its key wrapper
            if (Array.isArray(response.result)) {
                response.result = { bullets: response.result };
            } else {
                throw new AppError(500, 'AI_PARSE_ERROR', 'Unexpected AI JSON structure returned.');
            }
        }

        return response;
    },

    async improveSummary(userId: string, data: ImproveSummaryDTO) {
        const systemPrompt = "You are an expert resume writer. Rewrite this professional summary to be compelling and ATS-optimized. Return ONLY a valid JSON object with a single 'summary' string key, no extra commentary or formatting.";
        const userPrompt = `Role: ${data.role}\nYears of experience: ${data.experienceYears || 'unspecified'}\nCurrent summary:\n${data.summary}`;

        const response = await processAIRequest(userId, systemPrompt, userPrompt, 'improve_summary', CREDIT_COSTS.AI_SUGGESTION);

        if (!response.result.summary || typeof response.result.summary !== 'string') {
            throw new AppError(500, 'AI_PARSE_ERROR', 'Unexpected AI JSON structure returned.');
        }

        return response;
    },

    async improveCoverLetter(userId: string, data: ImproveCoverLetterDTO) {
        const systemPrompt = "You are an expert career coach and cover letter writer. Improve this cover letter body to be compelling, action-oriented, and professional. Return ONLY a valid JSON object with a single 'body' string key, no extra commentary.";
        const userPrompt = `Role applying for: ${data.role || 'unspecified'}\nCompany: ${data.company || 'unspecified'}\nCurrent body:\n${data.body}`;

        const response = await processAIRequest(userId, systemPrompt, userPrompt, 'improve_cover_letter', CREDIT_COSTS.AI_SUGGESTION);

        if (!response.result.body || typeof response.result.body !== 'string') {
            throw new AppError(500, 'AI_PARSE_ERROR', 'Unexpected AI JSON structure returned.');
        }

        return response;
    },

    async generateBullets(userId: string, data: GenerateBulletsDTO) {
        const systemPrompt = "Generate exactly 5 strong resume bullet points for this role using action verbs and quantifiable results. Return ONLY a valid JSON object containing a 'bullets' string array of length 5.";
        const userPrompt = `Role: ${data.role} at ${data.company}\nResponsibilities: ${data.responsibilities}`;

        const response = await processAIRequest(userId, systemPrompt, userPrompt, 'generate_bullets', CREDIT_COSTS.AI_SUGGESTION);

        if (!response.result.bullets || !Array.isArray(response.result.bullets)) {
            if (Array.isArray(response.result)) {
                response.result = { bullets: response.result };
            } else {
                throw new AppError(500, 'AI_PARSE_ERROR', 'Unexpected AI JSON structure returned.');
            }
        }

        return response;
    },

    async suggestSkills(userId: string, data: SuggestSkillsDTO) {
        const systemPrompt = "Suggest relevant skills for this role that improve ATS scoring. Return ONLY a valid JSON object containing exactly two arrays of strings: 'technical' and 'soft', with 5-8 items each.";
        const userPrompt = `Role: ${data.role}\nCurrent skills: ${data.currentSkills.join(', ')}`;

        const response = await processAIRequest(userId, systemPrompt, userPrompt, 'suggest_skills', CREDIT_COSTS.AI_SUGGESTION);

        if (!response.result.technical || !response.result.soft || !Array.isArray(response.result.technical)) {
            throw new AppError(500, 'AI_PARSE_ERROR', 'Unexpected AI JSON structure returned.');
        }

        return response;
    },

    async rewriteSection(userId: string, data: RewriteSectionDTO) {
        const systemPrompt = "You are an expert resume writer. Rewrite the provided resume section per the instruction. Return only the rewritten content matching the original structure inside a JSON object with a 'content' key.";
        const userPrompt = `Section: ${data.sectionType}\nInstruction: ${data.instruction}\nContent:\n${data.content}`;

        const response = await processAIRequest(userId, systemPrompt, userPrompt, 'rewrite_section', CREDIT_COSTS.AI_FULL_REWRITE);

        if (!response.result.content || typeof response.result.content !== 'string') {
            throw new AppError(500, 'AI_PARSE_ERROR', 'Unexpected AI JSON structure returned.');
        }

        return response;
    }
};
