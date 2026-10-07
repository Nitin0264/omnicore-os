const express = require('express');
const router = express.Router();
const { getTasks, createTask } = require('./projectController');

router.route('/tasks')
  .get(getTasks)
  .post(createTask);

module.exports = router;