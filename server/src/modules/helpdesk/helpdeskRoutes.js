const express = require('express');
const router = express.Router();
const { getTickets, createTicket } = require('./helpdeskController');

router.route('/tickets')
  .get(getTickets)
  .post(createTicket);

module.exports = router;