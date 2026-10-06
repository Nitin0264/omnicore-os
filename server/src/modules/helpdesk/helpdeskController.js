const { Ticket } = require('./helpdeskModel');
const { aiToolsRegistry } = require('./aiToolsService');

exports.createTicket = async (req, res) => {
  try {
    const { subject, description, priority } = req.body;
    
    // Use our registry tool or direct model creation
    const ticket = await aiToolsRegistry.createTicket(req.user.tenantId, req.user.userId, {
      subject,
      description,
      priority
    });

    res.status(201).json({ status: 'success', data: ticket });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ tenantId: req.user.tenantId }).lean();
    res.status(200).json({ status: 'success', data: tickets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};