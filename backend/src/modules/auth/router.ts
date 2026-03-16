import { Router } from 'express';
import { AuthController } from './controller';
import { validateBody } from '../../middleware/validateRequest';
import { authenticate } from '../../middleware/authenticate';
import { authLimiter, resetPasswordLimiter } from '../../middleware/rateLimiter';
import { authSlowDown } from '../../middleware/slowDown';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
} from './schemas';

const authRouter = Router();

// Apply tight rate limits & slow down on sensitive endpoints
authRouter.post(
    '/register',
    authLimiter,
    authSlowDown,
    validateBody(registerSchema),
    AuthController.register
);

authRouter.post(
    '/login',
    authLimiter,
    authSlowDown,
    validateBody(loginSchema),
    AuthController.login
);

authRouter.post(
    '/forgot-password',
    authLimiter,
    authSlowDown,
    validateBody(forgotPasswordSchema),
    AuthController.forgotPassword
);

authRouter.post(
    '/reset-password',
    resetPasswordLimiter,
    validateBody(resetPasswordSchema),
    AuthController.resetPassword
);

authRouter.get('/verify-email', AuthController.verifyEmail);
authRouter.post('/resend-verification', authLimiter, authSlowDown, AuthController.resendVerification);

// Google OAuth
authRouter.get('/google', AuthController.googleAuthInit);
authRouter.get('/google/callback', AuthController.googleAuthCallback);

// Session Endpoints
authRouter.post('/refresh', AuthController.refreshTokens);

// Authenticated Endpoints
authRouter.post('/logout', authenticate, AuthController.logout);
authRouter.post('/logout-all', authenticate, AuthController.logoutAll);
authRouter.post('/change-password', authenticate, validateBody(changePasswordSchema), AuthController.changePassword);
authRouter.get('/me', authenticate, AuthController.getMe);
authRouter.patch('/me', authenticate, AuthController.updateProfile);

export { authRouter };
