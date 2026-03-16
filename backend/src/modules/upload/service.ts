import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import pool from '../../db/pool';
import { AppError } from '../credits/errors';

type MulterFile = any;

export const UploadService = {
    async uploadAvatar(userId: string, file: MulterFile) {
        if (!file) throw new AppError(400, 'BAD_REQUEST', 'No file provided');

        const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
        await fs.ensureDir(uploadDir);

        const filename = `${userId}.webp`;
        const filePath = path.join(uploadDir, filename);

        // Process image securely
        const info = await sharp(file.buffer)
            .rotate() // Auto-orient based on EXIF
            .resize(400, 400, {
                fit: 'cover',
                position: 'center',
            })
            .webp({ quality: 85 })
            .toFile(filePath);

        // Validate output size (< 200KB)
        if (info.size > 200 * 1024) {
            await fs.remove(filePath);
            throw new AppError(400, 'BAD_REQUEST', 'Processed image is too large');
        }

        const avatarUrl = `/uploads/avatars/${filename}`;

        // Update user profile
        await pool.query(
            'UPDATE users SET avatar_url = $1 WHERE id = $2',
            [avatarUrl, userId]
        );

        return { avatarUrl };
    },

    async uploadResumePhoto(userId: string, resumeId: string, file: MulterFile) {
        if (!file) throw new AppError(400, 'BAD_REQUEST', 'No file provided');

        // Verify resume ownership
        const res = await pool.query('SELECT user_id FROM resumes WHERE id = $1', [resumeId]);
        if (res.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'Resume not found');
        if (res.rows[0].user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'Unauthorized');

        const uploadDir = path.join(process.cwd(), 'uploads', 'photos', userId);
        await fs.ensureDir(uploadDir);

        const filename = `${resumeId}.webp`;
        const filePath = path.join(uploadDir, filename);

        // Process image securely
        const info = await sharp(file.buffer)
            .rotate()
            .withMetadata()
            .resize(300, 300, {
                fit: 'cover',
                position: 'center',
                withoutEnlargement: true,
            })
            .webp({ quality: 85 })
            .toFile(filePath);

        if (info.size > 200 * 1024) {
            await fs.remove(filePath);
            throw new AppError(400, 'BAD_REQUEST', 'Processed image is too large');
        }

        const photoUrl = `/uploads/photos/${userId}/${filename}`;

        return { photoUrl };
    }
};
