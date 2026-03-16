import OpenAI from 'openai';
import { config } from '../../config';
import { AppError } from '../credits/errors';
import winston from 'winston';

// Use default Winston logger or configured project logger
const logger = winston;

const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
    timeout: 30000, // 30s timeout configured globally per request
});

export async function callOpenAIWithRetry(
    systemPrompt: string,
    userPrompt: string,
    userId: string,
    actionName: string,
    cost: number
): Promise<string> {
    const startTime = Date.now();
    let attempt = 0;
    const maxAttempts = 2; // initial + 1 retry

    while (attempt < maxAttempts) {
        attempt++;
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 1000,
                temperature: 0.7,
                response_format: { type: 'json_object' } // Enforce JSON for the AI module responses
            });

            const duration = Date.now() - startTime;

            // Log analytics but NOT the prompts or direct responses for privacy
            logger.info(`AI Usage: User [${userId}] | Action [${actionName}] | Cost [${cost}] | Duration [${duration}ms]`);

            const result = completion.choices[0]?.message?.content;
            if (!result) {
                throw new AppError(503, 'AI_SERVICE_ERROR', 'Received empty response from AI service');
            }

            return result;

        } catch (error: any) {
            // Handle specific status conditions
            if (error instanceof OpenAI.APIError) {
                // OpenAI API Rate Limit (429) - Retry once if on first attempt
                if (error.status === 429 && attempt < maxAttempts) {
                    logger.warn(`AI Rate Limit (429) hit for action [${actionName}]. Retrying in 2 seconds...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue; // Retry loop
                }
            }

            const duration = Date.now() - startTime;
            logger.error(`AI Failure: User [${userId}] | Action [${actionName}] | Attempt [${attempt}] | Cost [${cost}] | Duration [${duration}ms] | Error: ${error.message}`);

            // Timeouts are wrapped natively or throw specific Axios/Fetch equivalent
            if (error.name === 'APITimeoutError' || error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
                throw new AppError(504, 'AI_TIMEOUT', 'The AI service took too long to respond. Please try again later.');
            }

            // Other errors
            throw new AppError(503, 'AI_SERVICE_ERROR', 'The AI service is temporarily unavailable.');
        }
    }

    throw new AppError(503, 'AI_SERVICE_ERROR', 'The AI service is temporarily unavailable after retries.');
}
