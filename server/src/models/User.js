const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['super_admin', 'workspace_owner', 'manager', 'developer', 'support_agent', 'customer'], 
    default: 'customer' 
  },
  refreshToken: { type: String, select: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);