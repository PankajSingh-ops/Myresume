const express = require("express");
const { config } = require("./src/config");

const app = express();
const PORT = config.PORT;

app.get("/", (req, res) => {
    res.send("Express server is running 🚀");
});

// Module routes
const resumesRouter = require('./src/modules/resumes/router').default;
const exportRouter = require('./src/modules/export/router').default;
const aiRouter = require('./src/modules/ai/router').default;

app.use('/api/resumes', resumesRouter);
app.use('/api', exportRouter); // Holds /export and /upload routes
app.use('/api/ai', aiRouter);

// Infrastructure and Cron Hooks
const { logger } = require('./src/lib/logger');
const { startCronJobs } = require('./src/jobs/cleanup');

// Start backend scheduled maintenance tasks
startCronJobs();

// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start Server
app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
});