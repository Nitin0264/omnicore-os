const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  status: { type: String, enum: ['backlog', 'in_progress', 'review', 'done'], default: 'backlog' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Compound index for high-performance multi-tenant filtering (Pillar 5)
taskSchema.index({ tenantId: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);