const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains userId, tenantId, role
    next();
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Not authorized, token failed' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };