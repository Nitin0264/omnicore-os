const User = require('../../../models/User');
const Tenant = require('../../../models/Tenant');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, tenantId: user.tenantId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Register a new Tenant Workspace and Owner Admin
exports.register = async (req, res) => {
  try {
    const { companyName, slug, name, email, password } = req.body;

    // Check if tenant slug already exists
    const existingTenant = await Tenant.findOne({ slug });
    if (existingTenant) {
      return res.status(400).json({ status: 'fail', message: 'Workspace slug already taken' });
    }

    // Create Tenant
    const tenant = await Tenant.create({ name: companyName, slug });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User as Workspace Owner
    const user = await User.create({
      tenantId: tenant._id,
      name,
      email,
      password: hashedPassword,
      role: 'workspace_owner'
    });

    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: tenant._id
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};