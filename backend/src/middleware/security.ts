import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import compression from 'compression';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import { config } from '../config/index';

export function configureSecurityMiddleware(app: Express) {
    // Trust Proxy: Required for rate-limiting and accurate IP detection behind reverse proxy
    app.set('trust proxy', 1);

    // Helmet: Secure HTTP headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
        },
    }));

    // CORS: Cross-Origin Resource Sharing
    const allowedOrigins = config.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    app.use(cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    }));

    // HPP: Prevent HTTP Parameter Pollution
    app.use(hpp());

    // Compression: Gzip response body
    app.use(compression());

    // Body Parsers: Parse incoming request bodies with explicit limits (increased to 2MB for profile images)
    app.use(express.json({ limit: '2mb' }));
    app.use(express.urlencoded({ extended: true, limit: '2mb' }));

    // Cookie Parser: Parse signed and unsigned cookies
    app.use(cookieParser(config.COOKIE_SECRET));
}
