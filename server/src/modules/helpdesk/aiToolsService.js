const { Ticket } = require('./helpdeskModel');
const { Product } = require('../inventory/inventoryModel');
const Task = require('../projects/projectModel');

// Define callable tools for the AI Orchestration layer
const aiToolsRegistry = {
  // Helpdesk Tool: Create a support ticket
  createTicket: async (tenantId, customerId, data) => {
    return await Ticket.create({
      tenantId,
      customerId,
      subject: data.subject,
      description: data.description,
      priority: data.priority || 'medium'
    });
  },

  // Inventory Tool: Check product stock levels
  checkStock: async (tenantId, sku) => {
    const product = await Product.findOne({ tenantId, sku });
    if (!product) return { error: 'Product SKU not found' };
    return { sku: product.sku, name: product.name, stock: product.stock, price: product.price };
  },

  // Project Management Tool: Create a bug/fix task from support context
  createTaskFromSupport: async (tenantId, userId, data) => {
    return await Task.create({
      tenantId,
      title: `[Support Bug] ${data.title}`,
      description: data.description,
      priority: 'high',
      createdBy: userId,
      status: 'backlog'
    });
  }
};

module.exports = { aiToolsRegistry };