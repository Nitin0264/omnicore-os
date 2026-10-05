const { Queue, Worker } = require('bullmq');
const { redisClient } = require('../config/redis');

// Create a BullMQ connection configuration using ioredis connection options or URL
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
};

// Define a background queue for asynchronous tasks
const omniQueue = new Queue('omnicore-background-jobs', { connection });

// Define the worker processor
const worker = new Worker('omnicore-background-jobs', async (job) => {
  console.log(`[BullMQ Worker] Processing job: ${job.name} (ID: ${job.id})`);
  
  switch (job.name) {
    case 'send-notification':
      // Simulate sending email/notification asynchronously
      console.log(`[Notification Worker] Sending alert to tenant: ${job.data.tenantId}`);
      break;
    default:
      console.log(`[BullMQ] Unknown job type: ${job.name}`);
  }
}, { connection });

worker.on('completed', (job) => {
  console.log(`[BullMQ Worker] Job ${job.id} completed successfully.`);
});

worker.on('failed', (job, err) => {
  console.error(`[BullMQ Worker] Job ${job.id} failed with error: ${err.message}`);
});

module.exports = { omniQueue };