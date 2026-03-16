import slowDown from 'express-slow-down';

// Express Slow Down for Auth Routes:
// Starts delaying responses after 5 requests in the given window.
// Adds 500ms delay per additional request, maxing out at 5000ms delay.
export const authSlowDown = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    delayAfter: 5, // Allow 5 requests per 15 min before delaying responses
    delayMs: (hits) => (hits - 5) * 500, // Add 500ms of delay per request above 5.
    maxDelayMs: 5000, // Maximum delay of 5000ms (5 seconds)
});
