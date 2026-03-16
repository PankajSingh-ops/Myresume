import puppeteer from 'puppeteer';
import jwt from 'jsonwebtoken';
import slugify from 'slugify';
import pool from '../../db/pool';
import { CreditsService } from '../credits/service';
import { CREDIT_COSTS } from '../credits/constants';
import { AppError } from '../credits/errors';
import { config } from '../../config';

export const ExportService = {

    generateExportToken(resumeId: string, userId: string): string {
        // Short-lived token generated just for Puppeteer to read the frontend render route securely
        return jwt.sign(
            { resumeId, sub: userId },
            config.JWT_ACCESS_SECRET,
            { expiresIn: '5m' }
        );
    },

    generateCoverLetterExportToken(coverLetterId: string, userId: string): string {
        return jwt.sign(
            { coverLetterId, sub: userId },
            config.JWT_ACCESS_SECRET,
            { expiresIn: '5m' }
        );
    },

    async exportResumePDF(userId: string, resumeId: string) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Verify ownership securely within this transaction context
            const resumeRes = await client.query(
                'SELECT title, user_id FROM resumes WHERE id = $1 FOR SHARE',
                [resumeId]
            );

            if (resumeRes.rowCount === 0) {
                throw new AppError(404, 'NOT_FOUND', 'Resume not found');
            }

            const resume = resumeRes.rows[0];
            if (resume.user_id !== userId) {
                throw new AppError(403, 'FORBIDDEN', 'You do not own this resume');
            }

            // 2. Atomic credit deduction BEFORE doing expensive Puppeteer work
            const newBalance = await CreditsService.deductCredits(
                userId,
                CREDIT_COSTS.PDF_EXPORT,
                'pdf_export',
                `PDF export: "${resume.title}"`,
                { resumeId },
                client
            );

            await client.query('COMMIT'); // Commit early, we secured the credits

            // 3. Generate short-lived render token
            const exportToken = this.generateExportToken(resumeId, userId);

            // 4. Puppeteer Processing
            const browser = await puppeteer.launch({
                headless: true, // newer headless logic in latest puppeteer
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                ]
            });

            try {
                const page = await browser.newPage();

                // Navigate to the secured frontend render route
                const targetUrl = `${config.FRONTEND_URL}/resume-render/${resumeId}?token=${exportToken}`;

                await page.goto(targetUrl, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });

                // Wait for the specific element that signals the React component is fully mounted and styled
                await page.waitForSelector('#resume-ready[data-ready="true"]', { timeout: 15000 });

                // Set a high-DPI A4 viewport for sharp text rendering
                await page.setViewport({
                    width: 794,
                    height: 1123,
                    deviceScaleFactor: 2
                });

                // Generate A4 borderless PDF
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                    margin: { top: 0, right: 0, bottom: 0, left: 0 }
                });

                const filename = `${slugify(resume.title, { lower: true, strict: true })}_resume.pdf`;

                return {
                    pdfBuffer,
                    filename,
                    credits: { deducted: CREDIT_COSTS.PDF_EXPORT, newBalance }
                };

            } finally {
                await browser.close();
            }

        } catch (error) {
            // Only rollback if the error happened BEFORE the COMMIT above
            try {
                await client.query('ROLLBACK');
            } catch (e) {
                // Ignore rollback errors if already committed
            }
            throw error;
        } finally {
            client.release();
        }
    },

    async exportCoverLetterPDF(userId: string, coverLetterId: string) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const clRes = await client.query(
                'SELECT title, user_id FROM cover_letters WHERE id = $1 FOR SHARE',
                [coverLetterId]
            );

            if (clRes.rowCount === 0) {
                throw new AppError(404, 'NOT_FOUND', 'Cover letter not found');
            }

            const coverLetter = clRes.rows[0];
            if (coverLetter.user_id !== userId) {
                throw new AppError(403, 'FORBIDDEN', 'You do not own this cover letter');
            }

            const newBalance = await CreditsService.deductCredits(
                userId,
                CREDIT_COSTS.PDF_EXPORT,
                'pdf_export',
                `PDF export: "${coverLetter.title}"`,
                { coverLetterId },
                client
            );

            await client.query('COMMIT');

            const exportToken = this.generateCoverLetterExportToken(coverLetterId, userId);

            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                ]
            });
            console.log(`[Export Cover Letter] Browser launched for ${coverLetterId}`);

            try {
                const page = await browser.newPage();
                console.log(`[Export Cover Letter] New page created`);

                page.on('console', msg => console.log('PUPPETEER LOG:', msg.text()));
                page.on('pageerror', (error: any) => console.log('PUPPETEER ERROR:', error?.message || error));
                page.on('response', response => {
                    const status = response.status();
                    if (status >= 400) {
                        console.log('PUPPETEER RESPONSE ERROR:', status, response.url());
                    }
                });

                const targetUrl = `${config.FRONTEND_URL}/cover-letter-render/${coverLetterId}?token=${exportToken}`;
                console.log(`[Export Cover Letter] Navigating to target URL: ${targetUrl}`);

                await page.goto(targetUrl, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });
                console.log(`[Export Cover Letter] Navigation complete`);

                try {
                    console.log(`[Export Cover Letter] Waiting for element #cover-letter-ready...`);
                    const element = await page.waitForSelector('#cover-letter-ready', { timeout: 20000 });
                    
                    if (!element) {
                        throw new Error('Element #cover-letter-ready not found in time');
                    }

                    console.log(`[Export Cover Letter] Element found. Waiting for data-ready="true"...`);
                    await page.waitForFunction(
                        () => {
                            const el = document.getElementById('cover-letter-ready');
                            return el && el.getAttribute('data-ready') === 'true';
                        },
                        { timeout: 20000 }
                    );
                    console.log(`[Export Cover Letter] Ready state confirmed!`);
                } catch (err: any) {
                    console.error(`[Export Cover Letter] Timeout or error waiting for ready state: ${err.message}`);
                    const screenshotPath = `cover_letter_error_${Date.now()}.png`;
                    await page.screenshot({ path: screenshotPath, fullPage: true });
                    console.error(`[Export Cover Letter] Saved error screenshot to ${screenshotPath}`);
                    throw new Error(`Failed to render cover letter for PDF export. Screenshot saved to ${screenshotPath}.`);
                }

                await page.setViewport({
                    width: 794,
                    height: 1123,
                    deviceScaleFactor: 2
                });

                console.log(`[Export Cover Letter] Generating PDF buffer...`);
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                    margin: { top: 0, right: 0, bottom: 0, left: 0 }
                });
                console.log(`[Export Cover Letter] PDF generated successfully`);

                const filename = `${slugify(coverLetter.title, { lower: true, strict: true })}_cover_letter.pdf`;

                return {
                    pdfBuffer,
                    filename,
                    credits: { deducted: CREDIT_COSTS.PDF_EXPORT, newBalance }
                };

            } finally {
                await browser.close();
                console.log(`[Export Cover Letter] Browser closed`);
            }

        } catch (error) {
            try {
                await client.query('ROLLBACK');
            } catch (e) {
                // Ignore
            }
            throw error;
        } finally {
            client.release();
        }
    }
};
