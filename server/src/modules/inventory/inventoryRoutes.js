const express = require('express');
const router = express.Router();
const { createOrder } = require('./inventoryController');
const { Product } = require('./inventoryModel');
const { protect, restrictTo } = require('../../middleware/authMiddleware');

router.use(protect);

router.post('/orders', restrictTo('workspace_owner', 'manager'), createOrder);

router.post('/products', restrictTo('workspace_owner', 'manager'), async (req, res) => {
  try {
    const product = await Product.create({ tenantId: req.user.tenantId, ...req.body });
    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;