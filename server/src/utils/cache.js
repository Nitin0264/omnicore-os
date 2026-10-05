const { redisClient } = require('../config/redis');

// Middleware for GET routes to serve cached data if available
const cacheMiddleware = (keyPrefix, ttlSeconds = 60) => {
  return async (req, res, next) => {
    // Construct a unique cache key based on tenant and query parameters
    const tenantId = req.user?.tenantId || 'global';
    const cacheKey = `${tenantId}:${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json({
          status: 'success',
          source: 'cache',
          data: JSON.parse(cachedData)
        });
      }
      
      // Attach a helper method to response object so controller can set cache
      res.sendCachedResponse = async (data) => {
        await redisClient.setEx(cacheKey, ttlSeconds, JSON.stringify(data));
        res.status(200).json({
          status: 'success',
          source: 'database',
          data
        });
      };
      
      next();
    } catch (error) {
      console.error('[Redis Cache Error]', error);
      next(); // If Redis fails, fall back gracefully to database query
    }
  };
};

// Helper to invalidate cache when data changes
const invalidateCache = async (tenantId, keyPrefix) => {
  try {
    const pattern = `${tenantId}:${keyPrefix}:*`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`[Redis] Invalidated ${keys.length} keys for pattern: ${pattern}`);
    }
  } catch (error) {
    console.error('[Redis Invalidation Error]', error);
  }
};

module.exports = { cacheMiddleware, invalidateCache };