import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import Groq from 'groq-sdk';
import { config } from '../../config';
import { AppError } from '../credits/errors';
import winston from 'winston';

const logger = winston;

// Lazy-init Groq client
let groqClient: Groq | null = null;
function getGroq(): Groq {
    if (!groqClient) {
        groqClient = new Groq({ apiKey: config.GROQ_API_KEY });
    }
    return groqClient;
}

/**
 * Extract raw text from a PDF or DOCX file on disk.
 */
export async function extractText(filePath: string, mimetype: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);

    if (mimetype === 'application/pdf') {
        try {
            // pdf-parse v2 uses a class-based API
            const { PDFParse } = require('pdf-parse');
            const parser = new PDFParse({ data: new Uint8Array(buffer) });
            const result = await parser.getText();

            // result.text is the concatenated text from all pages
            const text = result.text || '';
            if (text.trim().length < 50) {
                throw new AppError(400, 'PARSE_ERROR', 'Could not extract meaningful text from the PDF. Please ensure it is not a scanned image.');
            }
            return text;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            logger.error(`PDF parse error: ${error.message}`);
            throw new AppError(400, 'PARSE_ERROR', 'Failed to read the PDF file. It may be corrupted or password-protected.');
        }
    }

    if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimetype === 'application/msword'
    ) {
        try {
            const mammoth = await import('mammoth');
            const result = await mammoth.extractRawText({ buffer });
            if (!result.value || result.value.trim().length < 50) {
                throw new AppError(400, 'PARSE_ERROR', 'Could not extract meaningful text from the document.');
            }
            return result.value;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            logger.error(`DOCX parse error: ${error.message}`);
            throw new AppError(400, 'PARSE_ERROR', 'Failed to read the Word document. It may be corrupted.');
        }
    }

    throw new AppError(400, 'INVALID_FILE_TYPE', 'Only PDF and DOCX files are supported.');
}

/**
 * Send extracted resume text to Groq (Llama) and get structured JSON back
 * matching the ResumeContent schema.
 */
export async function parseResumeWithGroq(rawText: string): Promise<any> {
    const groq = getGroq();

    const systemPrompt = `You are an expert resume parser. Given raw text extracted from a resume document, you MUST return a single valid JSON object matching the exact schema below. Do NOT include any commentary, explanation, or markdown — ONLY the JSON object.

SCHEMA:
{
  "personalInfo": {
    "fullName": "string",
    "title": "string (professional title/headline)",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string or empty",
    "linkedin": "string or empty",
    "github": "string or empty",
    "summary": "string (professional summary rewritten to be compelling and ATS-optimized, 2-4 sentences)"
  },
  "experience": [
    {
      "id": "unique_string",
      "company": "string",
      "position": "string",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM format or empty if current",
      "current": boolean,
      "description": "string (brief role description)",
      "bullets": ["string (achievement using STAR format with action verbs and metrics)"]
    }
  ],
  "education": [
    {
      "id": "unique_string",
      "institution": "string",
      "degree": "string",
      "field": "string (field of study)",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM format or empty",
      "gpa": "string or empty",
      "description": "string or empty"
    }
  ],
  "skills": [
    {
      "id": "unique_string",
      "category": "string (e.g. 'Programming Languages', 'Frameworks', 'Tools', 'Soft Skills')",
      "items": ["string"]
    }
  ],
  "projects": [
    {
      "id": "unique_string",
      "name": "string",
      "description": "string",
      "url": "string or empty",
      "technologies": ["string"],
      "bullets": ["string"]
    }
  ]
}

RULES:
1. Generate a unique 8-character alphanumeric ID for each "id" field.
2. Dates MUST be in "YYYY-MM" format (e.g. "2023-06"). If only a year is given, use "YYYY-01".
3. Rewrite bullet points using strong action verbs and quantifiable results (STAR format).
4. Rewrite the summary to be professional, compelling, and ATS-optimized.
5. Group skills into logical categories (e.g. "Programming Languages", "Frameworks & Libraries", "DevOps & Tools", "Soft Skills").
6. If a section has no data, use an empty array [].
7. Return ONLY the JSON object. No markdown, no code fences, no explanation.`;

    const userPrompt = `Parse this resume text and return structured JSON:\n\n${rawText.substring(0, 12000)}`;

    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
        attempt++;
        try {
            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.3,
                max_tokens: 4000,
                response_format: { type: 'json_object' },
            });

            const rawResult = completion.choices[0]?.message?.content;
            if (!rawResult) {
                throw new AppError(503, 'AI_SERVICE_ERROR', 'Received empty response from Groq.');
            }

            const parsed = JSON.parse(rawResult);

            // Validate essential structure
            if (!parsed.personalInfo || typeof parsed.personalInfo !== 'object') {
                throw new AppError(500, 'AI_PARSE_ERROR', 'AI response missing personalInfo.');
            }

            // Ensure arrays exist
            parsed.experience = Array.isArray(parsed.experience) ? parsed.experience : [];
            parsed.education = Array.isArray(parsed.education) ? parsed.education : [];
            parsed.skills = Array.isArray(parsed.skills) ? parsed.skills : [];
            parsed.projects = Array.isArray(parsed.projects) ? parsed.projects : [];

            // Ensure all items have IDs
            for (const exp of parsed.experience) {
                if (!exp.id) exp.id = nanoid(8);
                if (!Array.isArray(exp.bullets)) exp.bullets = [];
                if (typeof exp.current !== 'boolean') exp.current = !exp.endDate;
            }
            for (const edu of parsed.education) {
                if (!edu.id) edu.id = nanoid(8);
            }
            for (const skill of parsed.skills) {
                if (!skill.id) skill.id = nanoid(8);
                if (!Array.isArray(skill.items)) skill.items = [];
            }
            for (const proj of parsed.projects) {
                if (!proj.id) proj.id = nanoid(8);
                if (!Array.isArray(proj.bullets)) proj.bullets = [];
                if (!Array.isArray(proj.technologies)) proj.technologies = [];
            }

            logger.info(`Resume parsed successfully via Groq: ${parsed.experience.length} experiences, ${parsed.education.length} educations, ${parsed.skills.length} skill groups`);

            return parsed;

        } catch (error: any) {
            if (error instanceof AppError) throw error;

            if (error instanceof SyntaxError) {
                logger.error(`Groq JSON parse error on attempt ${attempt}: ${error.message}`);
                if (attempt < maxAttempts) continue;
                throw new AppError(500, 'AI_PARSE_ERROR', 'Failed to parse AI response as valid JSON.');
            }

            if (error?.status === 429 && attempt < maxAttempts) {
                logger.warn('Groq rate limit hit. Retrying in 2 seconds...');
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }

            logger.error(`Groq API error: ${error.message}`);
            throw new AppError(503, 'AI_SERVICE_ERROR', 'The AI resume parsing service is temporarily unavailable.');
        }
    }

    throw new AppError(503, 'AI_SERVICE_ERROR', 'AI service unavailable after retries.');
}
