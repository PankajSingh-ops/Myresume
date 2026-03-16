import dns from 'dns';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { config } from '../config';
import { logger } from './logger';

// Force IPv4 globally
dns.setDefaultResultOrder('ipv4first');

// Resolve SMTP host to IPv4 at startup to avoid IPv6 ENETUNREACH issues
let resolvedSmtpHost = config.SMTP_HOST;

dns.resolve4(config.SMTP_HOST, (err, addresses) => {
    if (!err && addresses.length > 0) {
        resolvedSmtpHost = addresses[0];
        logger.info(`Resolved SMTP host ${config.SMTP_HOST} to IPv4: ${resolvedSmtpHost}`);
    } else {
        logger.warn(`Could not resolve SMTP host to IPv4, using original: ${config.SMTP_HOST}`);
    }
});

// Create transporter lazily to use resolved IPv4 address
function getTransporter() {
    return nodemailer.createTransport({
        host: resolvedSmtpHost,
        port: config.SMTP_PORT,
        secure: config.SMTP_PORT === 465,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false,
            servername: config.SMTP_HOST, // Use original hostname for TLS SNI
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    } as any);
}

/**
 * Helper to safely trigger fire-and-forget emails
 * We do not want email delivery failure to crash authentication or core app flows.
 */
async function sendEmailSafely(mailOptions: SendMailOptions, eventName: string) {
    try {
        await getTransporter().sendMail({
            ...mailOptions,
            from: `Resume Builder <${config.SMTP_FROM}>`,
        });
        logger.info(`Email sent successfully: [${eventName}] to ${mailOptions.to}`);
    } catch (error: any) {
        logger.error(`Email delivery failed: [${eventName}] to ${mailOptions.to} | Error: ${error.message}`);
        // INTENTIONALLY NOT THROWING: Prevents caller crash 
    }
}

// ----------------------------------------------------
// Transactional Mail Templates
// ----------------------------------------------------

export const EmailService = {
    async sendVerificationEmail(to: string, firstName: string, verificationUrl: string) {
        const mailOptions = {
            to,
            subject: 'Verify your Resume Builder account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Welcome to Resume Builder!</h2>
                    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
                    <p style="color: #555; font-size: 16px;">Thanks for signing up. Please verify your email address to unlock your free credits and start building your resume.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background-color: #007bff; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Verify Email Address</a>
                    </div>
                    <p style="color: #777; font-size: 14px; text-align: center;">This link expires in 24 hours.</p>
                </div>
            `,
            text: `Hi ${firstName},\n\nPlease verify your Resume Builder account by visiting this link: \n${verificationUrl}\n\nThis link expires in 24 hours.`
        };

        return sendEmailSafely(mailOptions, 'Email Verification');
    },

    async sendPasswordResetEmail(to: string, firstName: string, resetUrl: string) {
        const mailOptions = {
            to,
            subject: 'Reset your Resume Builder password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #d9534f;">Password Reset Request</h2>
                    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
                    <p style="color: #555; font-size: 16px;">We received a request to reset the password associated with this email address.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #d9534f; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="color: #d9534f; font-weight: bold; font-size: 14px; text-align: center;">WARNING: This link expires in 1 hour.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #888; font-size: 12px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
            text: `Hi ${firstName},\n\nWe received a password reset request. Reset it here: \n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`
        };

        return sendEmailSafely(mailOptions, 'Password Reset');
    },

    async sendWelcomeEmail(to: string, firstName: string, creditsBalance: number = 100) {
        const mailOptions = {
            to,
            subject: 'Welcome to Resume Builder 🎉 — You have 100 free credits!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #5cb85c; text-align: center;">Welcome Aboard, ${firstName}! 🎉</h2>
                    <p style="color: #555; font-size: 16px;">You've officially joined Resume Builder and received <strong>${creditsBalance} free credits</strong> to get started right away!</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #333;">Token Cost Breakdown:</h3>
                        <table style="width: 100%; color: #555;">
                            <tr><td style="padding: 5px 0;">Create/Duplicate Resume</td><td style="text-align: right; font-weight: bold;">20 credits</td></tr>
                            <tr><td style="padding: 5px 0;">Professional PDF Export</td><td style="text-align: right; font-weight: bold;">5 credits</td></tr>
                            <tr><td style="padding: 5px 0;">AI Content Suggestion</td><td style="text-align: right; font-weight: bold;">2 credits</td></tr>
                            <tr><td style="padding: 5px 0;">AI Full Section Rewrite</td><td style="text-align: right; font-weight: bold;">10 credits</td></tr>
                        </table>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${config.FRONTEND_URL}/dashboard" style="background-color: #5cb85c; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Start Building Your Resume</a>
                    </div>
                </div>
            `,
            text: `Welcome Aboard, ${firstName}!\n\nYou've received ${creditsBalance} free credits to get started!\n\nCosts:\nCreate Resume: 20\nExport PDF: 5\nAI Suggestion: 2\nAI Rewrite: 10\n\nLogin at: ${config.FRONTEND_URL}/dashboard`
        };

        return sendEmailSafely(mailOptions, 'Welcome Notification');
    },

    async sendPasswordChangedEmail(to: string, firstName: string) {
        const mailOptions = {
            to,
            subject: 'Security Alert: Your Resume Builder password was changed',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Security Alert</h2>
                    <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
                    <p style="color: #555; font-size: 16px;">Your Resume Builder password was just updated successfully.</p>
                    <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #ffeeba;">
                        <strong>Action Required:</strong> If you did not make this change, please contact support and reset your password immediately via the login portal.
                    </div>
                </div>
            `,
            text: `Hi ${firstName},\n\nYour password was just changed. If this wasn't you, reset your password immediately via the login page.`
        };

        return sendEmailSafely(mailOptions, 'Password Changed Alert');
    }
};
