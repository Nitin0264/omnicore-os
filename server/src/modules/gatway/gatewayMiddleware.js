const { v4: uuidv4 } = require('uuid');
const { redisClient } = require('../config/redis');
const ApiKey = require('../modules/gateway/gatewayModel');
const bcrypt = require('bcryptjs');

// 1. Correlation ID Middleware for Traceability
const correlationIdMiddleware = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
};

// 2. Gateway API Key & Rate Limit Middleware
const gatewayAuthAndLimit = async (req, res, next) => {
  const rawKey = req.headers['x-api-key'];
  if (!rawKey) {
    return res.status(401).json({ status: 'fail', message: 'API Key missing in x-api-key header' });
  }

  try {
    const prefix = rawKey.substring(0, 7);
    const storedKeys = await ApiKey.find({ prefix, isActive: true });
    
    let validKeyRecord = null;
    for (const keyDoc of storedKeys) {
      const match = await bcrypt.compare(rawKey, keyDoc.keyHash);
      if (match) {
        validKeyRecord = keyDoc;
        break;
      }
    }

    if (!validKeyRecord) {
      return res.status(403).json({ status: 'fail', message: 'Invalid or revoked API key' });
    }

    // Redis Token-Bucket Rate Limiting Check (Pillar 2 & 7)
    const currentMinute = Math.floor(Date.now() / 60000);
    const rateLimitKey = `rate_limit:${validKeyRecord._id}:${currentMinute}`;
    
    const requestsCount = await redisClient.incr(rateLimitKey);
    if (requestsCount === 1) {
      await redisClient.expire(rateLimitKey, 60); // Expire window in 60 seconds
    }

    if (requestsCount > validKeyRecord.rateLimitPerMinute) {
      return res.status(429).json({ 
        status: 'fail', 
        message: 'Rate limit exceeded. Too many requests.' 
      });
    }

    req.tenantId = validKeyRecord.tenantId;
    next();
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { correlationIdMiddleware, gatewayAuthAndLimit };