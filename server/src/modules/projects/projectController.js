const getTasks = (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: []
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const createTask = (req, res) => {
  try {
    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask
};