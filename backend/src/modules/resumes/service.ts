import pool from '../../db/pool';
import { CreateResumeDTO, UpdateResumeDTO, ResumeContent, ResumeSettings } from './schemas';
import { AppError } from '../credits/errors';
import { CreditsService } from '../credits/service';
import { CREDIT_COSTS } from '../credits/constants';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

export const ResumesService = {
    async createResume(userId: string, data: CreateResumeDTO) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Deduct credits
            const newBalance = await CreditsService.deductCredits(
                userId,
                CREDIT_COSTS.RESUME_CREATE,
                'resume_create',
                `Created resume: "${data.title}"`,
                {},
                client
            );

            // 2. Generate slug
            const slug = `${slugify(data.title, { lower: true, strict: true })}-${nanoid(8)}`;

            const settings: Record<string, any> = data.settings || {};
            if (data.templateId) {
                settings.templateId = data.templateId;
            }

            // 3. Insert resume
            const resumeRes = await client.query(
                `INSERT INTO resumes (user_id, title, slug, template_id, content, settings)
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
            const resume = resumeRes.rows[0];

            // 4. Insert initial version
            await client.query(
                `INSERT INTO resume_versions (resume_id, version_number, content)
         VALUES ($1, $2, $3)`,
                [resume.id, 1, data.content || {}]
            );

            await client.query('COMMIT');

            return {
                resume,
                credits: { deducted: CREDIT_COSTS.RESUME_CREATE, newBalance }
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async getResumeById(resumeId: string, userId: string) {
        const res = await pool.query(
            'SELECT * FROM resumes WHERE id = $1',
            [resumeId]
        );

        if (res.rowCount === 0) {
            throw new AppError(404, 'NOT_FOUND', 'Resume not found');
        }

        const resume = res.rows[0];
        if (resume.user_id !== userId && !resume.is_public) {
            throw new AppError(403, 'FORBIDDEN', 'You do not have permission to view this resume');
        }

        return resume;
    },

    async getResumeBySlug(slug: string, options?: { ipAddress?: string; userAgent?: string }) {
        const res = await pool.query(
            'SELECT * FROM resumes WHERE slug = $1',
            [slug]
        );

        if (res.rowCount === 0) {
            throw new AppError(404, 'NOT_FOUND', 'Resume not found');
        }

        const resume = res.rows[0];
        if (!resume.is_public) {
            throw new AppError(403, 'FORBIDDEN', 'This resume is private');
        }

        // Record Analytics View
        if (options) {
            try {
                await pool.query(
                    'INSERT INTO resume_analytics (resume_id, ip_address, user_agent) VALUES ($1, $2, $3)',
                    [resume.id, options.ipAddress || null, options.userAgent || null]
                );
            } catch (error) {
                console.error('Failed to insert resume analytics:', error);
                // Do not block the request if analytics fails
            }
        }

        return resume;
    },

    async getUserResumes(userId: string, options: { page: number; limit: number; search?: string }) {
        const { page, limit, search } = options;
        const offset = (page - 1) * limit;

        let countQuery = 'SELECT COUNT(*) FROM resumes WHERE user_id = $1';
        let dataQuery = `
      SELECT id, title, slug, template_id, content, settings, thumbnail_url, last_edited_at, created_at, is_public 
      FROM resumes 
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

    async updateResume(resumeId: string, userId: string, data: UpdateResumeDTO) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Verify ownership
            const getRes = await client.query('SELECT user_id, content FROM resumes WHERE id = $1 FOR UPDATE', [resumeId]);
            if (getRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Resume not found');

            const resume = getRes.rows[0];
            if (resume.user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'You do not own this resume');

            // Save version
            const maxVersionRes = await client.query('SELECT COALESCE(MAX(version_number), 0) as max_version FROM resume_versions WHERE resume_id = $1', [resumeId]);
            const nextVersion = parseInt(maxVersionRes.rows[0].max_version, 10) + 1;

            await client.query(
                'INSERT INTO resume_versions (resume_id, version_number, content) VALUES ($1, $2, $3)',
                [resumeId, nextVersion, resume.content]
            );

            // Cleanup old versions (> 50)
            const versionCountRes = await client.query('SELECT COUNT(*) FROM resume_versions WHERE resume_id = $1', [resumeId]);
            if (parseInt(versionCountRes.rows[0].count, 10) > 50) {
                await client.query(
                    `DELETE FROM resume_versions 
           WHERE id IN (
             SELECT id FROM resume_versions WHERE resume_id = $1 ORDER BY version_number ASC LIMIT 1
           )`,
                    [resumeId]
                );
            }

            // Update resume
            const updates: string[] = [];
            const values: any[] = [];
            let paramCounter = 1;

            if (data.title !== undefined) {
                updates.push(`title = $${paramCounter}`);
                values.push(data.title);
                paramCounter++;
            }

            if (data.content !== undefined) {
                // We merge JSON deeply in production apps, but a direct replace works here 
                // per the user request. Or we could use postgres aggregate to patch JSON.
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
          UPDATE resumes 
          SET ${updates.join(', ')} 
          WHERE id = $${paramCounter} 
          RETURNING *`;
                values.push(resumeId);

                const updatedRes = await client.query(updateQuery, values);
                await client.query('COMMIT');
                return updatedRes.rows[0];
            }

            await client.query('COMMIT');
            return resume;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async deleteResume(resumeId: string, userId: string) {
        // Verify ownership and delete
        const res = await pool.query(
            'DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id',
            [resumeId, userId]
        );

        if (res.rowCount === 0) {
            throw new AppError(404, 'NOT_FOUND', 'Resume not found or you do not have permission to delete it');
        }

        return true; // successful deletion
    },

    async duplicateResume(resumeId: string, userId: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Get original
            const getRes = await client.query('SELECT * FROM resumes WHERE id = $1', [resumeId]);
            if (getRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Source resume not found');

            const original = getRes.rows[0];
            if (original.user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'You do not own this resume');

            // 2. Deduct credits
            const newBalance = await CreditsService.deductCredits(
                userId,
                CREDIT_COSTS.RESUME_CREATE,
                'resume_create',
                `Duplicated resume: "${original.title}"`,
                { sourceResumeId: resumeId },
                client
            );

            // 3. Insert duplicate
            const newTitle = `${original.title} (Copy)`;
            const newSlug = `${original.slug}-copy-${nanoid(4)}`;

            const duplicateRes = await client.query(
                `INSERT INTO resumes (user_id, title, slug, template_id, content, settings, thumbnail_url)
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
            const newResume = duplicateRes.rows[0];

            // 4. Initial version
            await client.query(
                `INSERT INTO resume_versions (resume_id, version_number, content)
         VALUES ($1, $2, $3)`,
                [newResume.id, 1, newResume.content]
            );

            await client.query('COMMIT');

            return {
                resume: newResume,
                credits: { deducted: CREDIT_COSTS.RESUME_CREATE, newBalance }
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async getVersions(resumeId: string, userId: string) {
        const verifyRes = await pool.query('SELECT user_id FROM resumes WHERE id = $1', [resumeId]);
        if (verifyRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Resume not found');
        if (verifyRes.rows[0].user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'Not authorized');

        const res = await pool.query(
            'SELECT id, version_number, created_at FROM resume_versions WHERE resume_id = $1 ORDER BY version_number DESC',
            [resumeId]
        );

        return res.rows;
    },

    async getVersionContent(resumeId: string, versionId: string, userId: string) {
        const verifyRes = await pool.query('SELECT user_id FROM resumes WHERE id = $1', [resumeId]);
        if (verifyRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Resume not found');
        if (verifyRes.rows[0].user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'Not authorized');

        const res = await pool.query(
            'SELECT * FROM resume_versions WHERE resume_id = $1 AND id = $2',
            [resumeId, versionId]
        );

        if (res.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Version not found');

        return res.rows[0];
    },

    async restoreVersion(resumeId: string, versionId: string, userId: string) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Verify ownership
            const getRes = await client.query('SELECT user_id, content FROM resumes WHERE id = $1 FOR UPDATE', [resumeId]);
            if (getRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Resume not found');
            if (getRes.rows[0].user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'Not authorized');

            const currentResume = getRes.rows[0];

            // Get version content
            const versionRes = await client.query('SELECT content FROM resume_versions WHERE id = $1 AND resume_id = $2', [versionId, resumeId]);
            if (versionRes.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Version not found');

            const versionContent = versionRes.rows[0].content;

            // Save current state as new version
            const maxVersionRes = await client.query('SELECT COALESCE(MAX(version_number), 0) as max_version FROM resume_versions WHERE resume_id = $1', [resumeId]);
            const nextVersion = parseInt(maxVersionRes.rows[0].max_version, 10) + 1;

            await client.query(
                'INSERT INTO resume_versions (resume_id, version_number, content) VALUES ($1, $2, $3)',
                [resumeId, nextVersion, currentResume.content]
            );

            // Cleanup oldest if > 50
            const versionCountRes = await client.query('SELECT COUNT(*) FROM resume_versions WHERE resume_id = $1', [resumeId]);
            if (parseInt(versionCountRes.rows[0].count, 10) > 50) {
                await client.query(
                    `DELETE FROM resume_versions 
           WHERE id IN (
             SELECT id FROM resume_versions WHERE resume_id = $1 ORDER BY version_number ASC LIMIT 1
           )`,
                    [resumeId]
                );
            }

            // Restore content to main table
            const updateRes = await client.query(
                'UPDATE resumes SET content = $1, last_edited_at = NOW() WHERE id = $2 RETURNING *',
                [versionContent, resumeId]
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

    async updateThumbnail(resumeId: string, userId: string, thumbnailUrl: string) {
        const res = await pool.query(
            'UPDATE resumes SET thumbnail_url = $1, last_edited_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
            [thumbnailUrl, resumeId, userId]
        );

        if (res.rowCount === 0) {
            throw new AppError(404, 'NOT_FOUND', 'Resume not found or not authorized');
        }

        return res.rows[0];
    }
};
