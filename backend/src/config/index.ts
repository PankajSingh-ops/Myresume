import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the .env file
// If running from root, path.join(__dirname, '../../.env') goes from backend/src/config/ back to backend/
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(5000),

    DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
    REDIS_URL: z.string().url("REDIS_URL must be a valid URL"),

    JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
    JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    COOKIE_SECRET: z.string().min(1, "COOKIE_SECRET is required"),

    GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
    GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
    GOOGLE_CALLBACK_URL: z.string().url("GOOGLE_CALLBACK_URL must be a valid URL"),

    OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
    GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),

    SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_USER: z.string().min(1, "SMTP_USER is required"),
    SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
    SMTP_FROM: z.string().min(1, "SMTP_FROM is required"),

    FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL"),
    ALLOWED_ORIGINS: z.string().min(1, "ALLOWED_ORIGINS is required"),

    BCRYPT_ROUNDS: z.coerce.number().default(12),
    MAX_FILE_SIZE_MB: z.coerce.number().default(5),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
    RATE_LIMIT_MAX: z.coerce.number().default(100),

    SIGNUP_BONUS_CREDITS: z.coerce.number().default(100),
    RESUME_CREATION_COST: z.coerce.number().default(20),
    PDF_EXPORT_COST: z.coerce.number().default(5),
    AI_SUGGESTION_COST: z.coerce.number().default(2),

    RAZORPAY_KEY_ID: z.string().min(1, "RAZORPAY_KEY_ID is required"),
    RAZORPAY_KEY_SECRET: z.string().min(1, "RAZORPAY_KEY_SECRET is required"),
    RAZORPAY_WEBHOOK_SECRET: z.string().min(1, "RAZORPAY_WEBHOOK_SECRET is required"),
});

// Infer and export the configuration type
export type Config = z.infer<typeof envSchema>;

function parseEnv(): Config {
    // If fallback is needed where dotenv.config() above didn't load properly, 
    // you might just rely on process.env being fed in by the CLI/runner
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 2));
        process.exit(1); // Crash immediately
    }

    return parsed.data;
}

// Export a typed config object
export const config = parseEnv();
