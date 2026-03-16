import fs from 'fs-extra';
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';
import { logger } from '../lib/logger';
import { AppError } from '../modules/credits/errors';

export class FileParserService {
    /**
     * Main method to extract text from a file based on its mime type
     */
    public async parseFile(filePath: string, mimetype: string): Promise<string> {
        try {
            logger.info({ message: `Starting file parsing for type: ${mimetype}` });

            let extractedText = '';

            // Route parsing based on mimetype
            if (mimetype === 'application/pdf') {
                extractedText = await this.parsePDF(filePath);
            } else if (
                mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                mimetype === 'application/msword'
            ) {
                extractedText = await this.parseDOCX(filePath);
            } else if (mimetype === 'text/plain') {
                extractedText = await this.parseTXT(filePath);
            } else {
                throw new AppError(400, 'UNSUPPORTED_FILE_TYPE', `Unsupported file type: ${mimetype}`);
            }

            const cleanedText = this.cleanText(extractedText);

            logger.info({ message: `Successfully parsed file and extracted ${cleanedText.length} characters` });

            return cleanedText;
        } catch (error: any) {
            logger.error({
                message: `Failed to parse file: ${error.message}`,
                stack: error.stack
            });

            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'FILE_PARSING_ERROR', 'An error occurred while parsing the file content.');
        } finally {
            // Clean up the temporary file immediately after parsing (success or fail)
            try {
                const exists = await fs.pathExists(filePath);
                if (exists) {
                    await fs.unlink(filePath);
                    logger.debug({ message: `Deleted temp file: ${filePath}` });
                }
            } catch (cleanupError: any) {
                logger.error({
                    message: `Failed to delete temp file ${filePath}: ${cleanupError.message}`
                });
            }
        }
    }

    private async parsePDF(filePath: string): Promise<string> {
        const fileBuffer = await fs.readFile(filePath);
        const parser = new PDFParse({ data: fileBuffer });
        const data = await parser.getText();
        await parser.destroy();
        return data.text;
    }

    private async parseDOCX(filePath: string): Promise<string> {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    }

    private async parseTXT(filePath: string): Promise<string> {
        return await fs.readFile(filePath, 'utf-8');
    }

    private cleanText(text: string): string {
        if (!text) return '';

        return text
            // Replace non-breaking spaces and irregular whitespace characters with standard space
            .replace(/[\u00A0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/g, ' ')
            // Remove null bytes
            .replace(/\0/g, '')
            // Contract multiple consecutive blank lines into a single blank line
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            // Contract multiple spaces into single space
            .replace(/[ ]{2,}/g, ' ')
            .trim();
    }
}

export const fileParserService = new FileParserService();
