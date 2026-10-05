const express = require('express');
const router = express.Router();
const { getTasks, createTask } = require('./projectController');
const { protect, restrictTo } = require('../../middleware/authMiddleware');
const { cacheMiddleware } = require('../../utils/cache');

router.use(protect); // All project routes require authentication

router.route('/')
  .get(cacheMiddleware('tasks', 60), getTasks) // Cache for 60 seconds
  .post(restrictTo('workspace_owner', 'manager', 'developer'), createTask);

module.exports = router;