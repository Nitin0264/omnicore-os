const express = require('express');
const router = express.Router();
const { register, login } = require('./authController');

router.post('/register', register);
router.post('/login', login);

router.get('/protected-test', require('../../middleware/authMiddleware').protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'You have accessed a protected route!',
    user: req.user
  });
});

module.exports = router;