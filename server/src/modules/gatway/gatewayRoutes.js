const express = require('express');
const router = express.Router();
const { generateApiKey } = require('./gatewayController');
const { protect, restrictTo } = require('../../middleware/authMiddleware');
const { gatewayAuthAndLimit } = require('../../middleware/gatewayMiddleware');

// Internal management route for generating keys
router.post('/keys', protect, restrictTo('workspace_owner'), generateApiKey);

// Example public gateway endpoint consumed by external apps using x-api-key
router.get('/proxy/data-feed', gatewayAuthAndLimit, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Data successfully fetched via OmniCore OS API Gateway',
    tenantId: req.tenantId,
    correlationId: req.correlationId
  });
});

module.exports = router;