const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  aiSentiment: { type: String, enum: ['positive', 'neutral', 'negative', 'frustrated'], default: 'neutral' },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

ticketSchema.index({ tenantId: 1, status: 1 });

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = { Ticket };