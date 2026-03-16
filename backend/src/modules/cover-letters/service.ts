import pool from '../../db/pool';
import { CreateCoverLetterDTO, UpdateCoverLetterDTO } from './schemas';
import { AppError } from '../credits/errors';
import { CreditsService } from '../credits/service';
import { CREDIT_COSTS } from '../credits/constants';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

export const CoverLettersService = {
    async createCoverLetter(userId: string, data: CreateCoverLetterDTO) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const newBalance = await CreditsService.deductCredits(
                userId,
                CREDIT_COSTS.COVER_LETTER_CREATE,
                'cover_letter_create',
                `Created cover letter: "${data.title}"`,
                {},
                client
            );

            const slug = `${slugify(data.title, { lower: true, strict: true })}-${nanoid(8)}`;

            const settings: Record<string, any> = data.settings || {};
            if (data.templateId) {
                settings.templateId = data.templateId;
            }

            const res = await client.query(
                `INSERT INTO cover_letters (user_id, title, slug, template_id, content, settings)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
                [
                    userId,
                    data.title,
                    slug,
                    data.templateId || 'classic',
                    data.content || {},
                    settings
                ]
            );
            const coverLetter = res.rows[0];

            await client.query(
                `INSERT INTO cover_letter_versions (cover_letter_id, version_number, content)
         VALUES ($1, $2, $3)`,
                [coverLetter.id, 1, data.content || {}]
            );

            await client.query('COMMIT');

            return {
                coverLetter,
                credits: { deducted: CREDIT_COSTS.COVER_LETTER_CREATE, newBalance }
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async getCoverLetterById(coverLetterId: string, userId: string) {
        const res = await pool.query(
            'SELECT * FROM cover_letters WHERE id = $1',
            [coverLetterId]
        );

        if (res.rowCount === 0) {
            throw new AppError(404, 'NOT_FOUND', 'Cover Letter not found');
        }

        const coverLetter = res.rows[0];
        if (coverLetter.user_id !== userId && !coverLetter.is_public) {
            throw new AppError(403, 'FORBIDDEN', 'You do not have permission to view this cover letter');
        }

        return coverLetter;
    },

    async getCoverLetterBySlug(slug: string, options?: { ipAddress?: string; userAgent?: string }) {
        const res = await pool.query(
            'SELECT * FROM cover_letters WHERE slug = $1',
            [slug]
        );

        if (res.rowCount === 0) {
            throw new AppError(404, 'NOT_FOUND', 'Cover Letter not found');
        }

        const coverLetter = res.rows[0];
        if (!coverLetter.is_public) {
            throw new AppError(403, 'FORBIDDEN', 'This cover letter is private');
        }

        // Record Analytics View
        if (options) {
            try {
                await pool.query(
                    'INSERT INTO cover_letter_analytics (cover_letter_id, ip_address, user_agent) VALUES ($1, $2, $3)',
                    [coverLetter.id, options.ipAddress || null, options.userAgent || null]
                );
            } catch (error) {
                console.error('Failed to insert cover letter analytics:', error);
                // Do not block the request if analytics fails
            }
        }

        return coverLetter;
    },

    async getUserCoverLetters(userId: string, options: { page: number; limit: number; search?: string }) {
        const { page, limit, search } = options;
        const offset = (page - 1) * limit;

        let countQuery = 'SELECT COUNT(*) FROM cover_letters WHERE user_id = $1';
        let dataQuery = `
      SELECT id, title, slug, template_id, content, settings, thumbnail_url, last_edited_at, created_at, is_public 
      FROM cover_letters 
      WHERE user_id = $1
    `;
        const queryParams: any[] = [userId];

        if (search) {
            countQuery += ' AND title ILIKE $2';
            dataQuery += ' AND title ILIKE $2';
            queryParams.push(`%${search}%`);
        }

        dataQuery += ` ORDER BY last_edited_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;

        const [countResult, rowsResult] = await Promise.all([
            pool.query(countQuery, search ? queryParams.slice(0, 2) : queryParams.slice(0, 1)),
            pool.query(dataQuery, [...queryParams, limit, offset]),
        ]);

        const total = parseInt(countResult.rows[0].count, 10);

        return {
            data: rowsResult.rows,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    },

    async updateCoverLetter(coverLetterId: string, userId: string, data: UpdateCoverLetterDTO) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const getRes = await client.query('SELECT user_id, content FROM cover_letters WHERE id = $1 FOR UPDATE', [coverLetterId]);
            if (getRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Cover Letter not found');

            const coverLetter = getRes.rows[0];
            if (coverLetter.user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'You do not own this cover letter');

            const maxVersionRes = await client.query('SELECT COALESCE(MAX(version_number), 0) as max_version FROM cover_letter_versions WHERE cover_letter_id = $1', [coverLetterId]);
            const nextVersion = parseInt(maxVersionRes.rows[0].max_version, 10) + 1;

            await client.query(
                'INSERT INTO cover_letter_versions (cover_letter_id, version_number, content) VALUES ($1, $2, $3)',
                [coverLetterId, nextVersion, coverLetter.content]
            );

            const versionCountRes = await client.query('SELECT COUNT(*) FROM cover_letter_versions WHERE cover_letter_id = $1', [coverLetterId]);
            if (parseInt(versionCountRes.rows[0].count, 10) > 50) {
                await client.query(
                    `DELETE FROM cover_letter_versions 
           WHERE id IN (
             SELECT id FROM cover_letter_versions WHERE cover_letter_id = $1 ORDER BY version_number ASC LIMIT 1
           )`,
                    [coverLetterId]
                );
            }

            const updates: string[] = [];
            const values: any[] = [];
            let paramCounter = 1;

            if (data.title !== undefined) {
                updates.push(`title = $${paramCounter}`);
                values.push(data.title);
                paramCounter++;
            }

            if (data.content !== undefined) {
                updates.push(`content = $${paramCounter}`);
                values.push(data.content);
                paramCounter++;
            }

            if (data.settings !== undefined) {
                updates.push(`settings = $${paramCounter}`);
                values.push(data.settings);
                paramCounter++;
            }

            if (data.isPublic !== undefined) {
                updates.push(`is_public = $${paramCounter}`);
                values.push(data.isPublic);
                paramCounter++;
            }

            if (updates.length > 0) {
                updates.push(`last_edited_at = NOW()`);

                const updateQuery = `
          UPDATE cover_letters 
          SET ${updates.join(', ')} 
          WHERE id = $${paramCounter} 
          RETURNING *`;
                values.push(coverLetterId);

                const updatedRes = await client.query(updateQuery, values);
                await client.query('COMMIT');
                return updatedRes.rows[0];
            }

            await client.query('COMMIT');
            return coverLetter;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async deleteCoverLetter(coverLetterId: string, userId: string) {
        const res = await pool.query(
            'DELETE FROM cover_letters WHERE id = $1 AND user_id = $2 RETURNING id',
            [coverLetterId, userId]
        );

        if (res.rowCount === 0) {
            throw new AppError(404, 'NOT_FOUND', 'Cover Letter not found or you do not have permission to delete it');
        }

        return true;
    },

    async duplicateCoverLetter(coverLetterId: string, userId: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const getRes = await client.query('SELECT * FROM cover_letters WHERE id = $1', [coverLetterId]);
            if (getRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Source cover letter not found');

            const original = getRes.rows[0];
            if (original.user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'You do not own this cover letter');

            const newBalance = await CreditsService.deductCredits(
                userId,
                CREDIT_COSTS.COVER_LETTER_CREATE,
                'cover_letter_create',
                `Duplicated cover letter: "${original.title}"`,
                { sourceCoverLetterId: coverLetterId },
                client
            );

            const newTitle = `${original.title} (Copy)`;
            const newSlug = `${original.slug}-copy-${nanoid(4)}`;

            const duplicateRes = await client.query(
                `INSERT INTO cover_letters (user_id, title, slug, template_id, content, settings, thumbnail_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
                [
                    userId,
                    newTitle,
                    newSlug,
                    original.template_id,
                    original.content,
                    original.settings,
                    original.thumbnail_url
                ]
            );
            const newCoverLetter = duplicateRes.rows[0];

            await client.query(
                `INSERT INTO cover_letter_versions (cover_letter_id, version_number, content)
         VALUES ($1, $2, $3)`,
                [newCoverLetter.id, 1, newCoverLetter.content]
            );

            await client.query('COMMIT');

            return {
                coverLetter: newCoverLetter,
                credits: { deducted: CREDIT_COSTS.COVER_LETTER_CREATE, newBalance }
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async getVersions(coverLetterId: string, userId: string) {
        const verifyRes = await pool.query('SELECT user_id FROM cover_letters WHERE id = $1', [coverLetterId]);
        if (verifyRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Cover Letter not found');
        if (verifyRes.rows[0].user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'Not authorized');

        const res = await pool.query(
            'SELECT id, version_number, created_at FROM cover_letter_versions WHERE cover_letter_id = $1 ORDER BY version_number DESC',
            [coverLetterId]
        );

        return res.rows;
    },

    async getVersionContent(coverLetterId: string, versionId: string, userId: string) {
        const verifyRes = await pool.query('SELECT user_id FROM cover_letters WHERE id = $1', [coverLetterId]);
        if (verifyRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Cover Letter not found');
        if (verifyRes.rows[0].user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'Not authorized');

        const res = await pool.query(
            'SELECT * FROM cover_letter_versions WHERE cover_letter_id = $1 AND id = $2',
            [coverLetterId, versionId]
        );

        if (res.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Version not found');

        return res.rows[0];
    },

    async restoreVersion(coverLetterId: string, versionId: string, userId: string) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const getRes = await client.query('SELECT user_id, content FROM cover_letters WHERE id = $1 FOR UPDATE', [coverLetterId]);
            if (getRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Cover Letter not found');
            if (getRes.rows[0].user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'Not authorized');

            const currentCoverLetter = getRes.rows[0];

            const versionRes = await client.query('SELECT content FROM cover_letter_versions WHERE id = $1 AND cover_letter_id = $2', [versionId, coverLetterId]);
            if (versionRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Version not found');

            const versionContent = versionRes.rows[0].content;

            const maxVersionRes = await client.query('SELECT COALESCE(MAX(version_number), 0) as max_version FROM cover_letter_versions WHERE cover_letter_id = $1', [coverLetterId]);
            const nextVersion = parseInt(maxVersionRes.rows[0].max_version, 10) + 1;

            await client.query(
                'INSERT INTO cover_letter_versions (cover_letter_id, version_number, content) VALUES ($1, $2, $3)',
                [coverLetterId, nextVersion, currentCoverLetter.content]
            );

            const versionCountRes = await client.query('SELECT COUNT(*) FROM cover_letter_versions WHERE cover_letter_id = $1', [coverLetterId]);
            if (parseInt(versionCountRes.rows[0].count, 10) > 50) {
                await client.query(
                    `DELETE FROM cover_letter_versions 
           WHERE id IN (
             SELECT id FROM cover_letter_versions WHERE cover_letter_id = $1 ORDER BY version_number ASC LIMIT 1
           )`,
                    [coverLetterId]
                );
            }

            const updateRes = await client.query(
                'UPDATE cover_letters SET content = $1, last_edited_at = NOW() WHERE id = $2 RETURNING *',
                [versionContent, coverLetterId]
            );

            await client.query('COMMIT');
            return updateRes.rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async updateThumbnail(coverLetterId: string, userId: string, thumbnailUrl: string) {
        const res = await pool.query(
            'UPDATE cover_letters SET thumbnail_url = $1, last_edited_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
            [thumbnailUrl, coverLetterId, userId]
        );

        if (res.rowCount === 0) {
            throw new AppError(404, 'NOT_FOUND', 'Cover Letter not found or not authorized');
        }

        return res.rows[0];
    }
};
