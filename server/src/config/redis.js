const Redis = require('ioredis');

// Connect to local Redis or fallback gracefully
const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  retryStrategy(times) {
    if (times > 3) {
      console.warn('[Redis] Connection failed. Running without Redis cache.');
      return null; // Stop retrying
    }
    return Math.min(times * 50, 2000);
  }
});

redisClient.on('error', (err) => {
  // Suppress continuous error logs if Redis isn't installed/running locally
});

module.exports = redisClient;