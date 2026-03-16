export class InsufficientCreditsError extends Error {
    statusCode = 402;
    code = 'INSUFFICIENT_CREDITS';

    constructor(public balance: number, public required: number) {
        super(`Insufficient credits. Required: ${required}, Available: ${balance}`);
        Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
    }
}

export class AppError extends Error {
    constructor(public statusCode: number, public code: string, message: string) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
