const Task = require('./projectModel');
const { invalidateCache } = require('../../utils/cache');

// Get all tasks for the tenant (Uses caching middleware, but handled directly or via controller helper)
exports.getTasks = async (req, res) => {
  try {
    // If cache middleware attached sendCachedResponse, we can use it
    const tasks = await Task.find({ tenantId: req.user.tenantId })
      .populate('assignedTo', 'name email')
      .lean(); // High performance lean query (Pillar 5)

    if (res.sendCachedResponse) {
      return res.sendCachedResponse(tasks);
    }
    
    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Create a task and clear cache
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;

    const task = await Task.create({
      tenantId: req.user.tenantId,
      title,
      description,
      priority,
      assignedTo,
      createdBy: req.user.userId
    });

    // Invalidate task list cache for this tenant (Pillar 2)
    await invalidateCache(req.user.tenantId, 'tasks');

    res.status(201).json({ status: 'success', data: task });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};