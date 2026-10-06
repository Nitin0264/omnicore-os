const express = require('express');
const router = express.Router();
const { createTicket, getTickets } = require('./helpdeskController');
const { protect, restrictTo } = require('../../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getTickets)
  .post(createTicket);

module.exports = router;