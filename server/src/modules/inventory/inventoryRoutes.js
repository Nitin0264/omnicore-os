const express = require('express');
const router = express.Router();
const { getInventory, createInventoryItem } = require('./inventoryController');

router.route('/')
  .get(getInventory)
  .post(createInventoryItem);

module.exports = router;