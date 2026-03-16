import multer from 'multer';
import { AppError } from '../modules/credits/errors';
import { config } from '../config';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError(400, 'BAD_REQUEST', 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
};

// Configure limits dynamically based on the .env / config
export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: config.MAX_FILE_SIZE_MB * 1024 * 1024,
        files: 1, // Only one file per request
    },
});
