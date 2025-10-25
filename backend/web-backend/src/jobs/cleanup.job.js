const cron = require('node-cron');
const { cleanupOldData } = require('../services/cleanup.service');

// Schedule a job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Running cleanup job...');
        await cleanupOldData();
        console.log('Cleanup job completed successfully.');
    } catch (error) {
        console.error('Error running cleanup job:', error);
    }
});