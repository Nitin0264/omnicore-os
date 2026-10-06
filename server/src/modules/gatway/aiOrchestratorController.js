const { executeAiToolCall } = require('./aiOrchestratorService');

// Endpoint for triggering cross-module agentic reasoning
exports.handleAgentQuery = async (req, res) => {
  try {
    const { prompt, selectedTool, toolArguments } = req.body;

    // If client/frontend passes a simulated or direct tool action request
    if (selectedTool) {
      const result = await executeAiToolCall(req.user.tenantId, req.user.userId, selectedTool, toolArguments);
      return res.status(200).json({
        status: 'success',
        orchestrationType: 'tool_executed',
        toolName: selectedTool,
        result
      });
    }

    // Default conversational response fallback demonstrating multi-module awareness
    res.status(200).json({
      status: 'success',
      orchestrationType: 'reasoning_simulation',
      message: `AI Agent received query: "${prompt}". Ready to coordinate across Helpdesk, Inventory, and Project Management modules using registered tools.`
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};