const { aiToolsRegistry } = require('../helpdesk/aiToolsService');

// Define JSON schema definitions for LLM function calling
const aiToolDefinitions = [
  {
    name: 'checkStock',
    description: 'Check inventory stock level for a given product SKU',
    parameters: {
      type: 'object',
      properties: {
        sku: { type: 'string', description: 'The product SKU code' }
      },
      required: ['sku']
    }
  },
  {
    name: 'createTicket',
    description: 'Create a new support ticket for a customer complaint',
    parameters: {
      type: 'object',
      properties: {
        subject: { type: 'string', description: 'Subject of the ticket' },
        description: { type: 'string', description: 'Detailed issue description' },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] }
      },
      required: ['subject', 'description']
    }
  },
  {
    name: 'createTaskFromSupport',
    description: 'Create a developer bug fix task from customer support insights',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title' },
        description: { type: 'string', description: 'Technical context or fix required' }
      },
      required: ['title', 'description']
    }
  }
];

// Orchestrator function to execute selected tool actions based on AI reasoning
const executeAiToolCall = async (tenantId, userId, toolName, args) => {
  console.log(`[AI Orchestrator] Executing tool: ${toolName} with args:`, args);

  switch (toolName) {
    case 'checkStock':
      return await aiToolsRegistry.checkStock(tenantId, args.sku);
    case 'createTicket':
      return await aiToolsRegistry.createTicket(tenantId, userId, args);
    case 'createTaskFromSupport':
      return await aiToolsRegistry.createTaskFromSupport(tenantId, userId, args);
    default:
      throw new Error(`Unsupported tool execution: ${toolName}`);
  }
};

module.exports = { aiToolDefinitions, executeAiToolCall };