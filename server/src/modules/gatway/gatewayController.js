const ApiKey = require('./gatewayModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate a new external API Key for developer tenants
exports.generateApiKey = async (req, res) => {
  try {
    const { name, rateLimitPerMinute } = req.body;
    
    // Generate raw key: oc_live_ + random bytes
    const rawKey = `oc_live_${crypto.randomBytes(24).toString('hex')}`;
    const prefix = rawKey.substring(0, 7);
    
    const salt = await bcrypt.genSalt(10);
    const keyHash = await bcrypt.hash(rawKey, salt);

    const apiKeyRecord = await ApiKey.create({
      tenantId: req.user.tenantId,
      name,
      keyHash,
      prefix,
      rateLimitPerMinute: rateLimitPerMinute || 60
    });

    // Return the raw key ONLY ONCE to the user
    res.status(201).json({
      status: 'success',
      apiKey: rawKey, // Show only once!
      data: {
        id: apiKeyRecord._id,
        name: apiKeyRecord.name,
        prefix: apiKeyRecord.prefix,
        rateLimitPerMinute: apiKeyRecord.rateLimitPerMinute
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};