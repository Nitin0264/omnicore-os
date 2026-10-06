const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  name: { type: String, required: true, trim: true },
  keyHash: { type: String, required: true, unique: true }, // Cryptographically hashed API key
  prefix: { type: String, required: true }, // First few visible characters for identification
  isActive: { type: Boolean, default: true },
  rateLimitPerMinute: { type: Number, default: 60 }
}, { timestamps: true });

module.exports = mongoose.model('ApiKey', apiKeySchema);