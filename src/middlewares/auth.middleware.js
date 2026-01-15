const jwt = require('jsonwebtoken');
const User = require('../modules/auth/auth.model');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

const verifyPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    
    if (!req.user.secretPin) {
      return res.status(400).json({ message: 'Secret PIN not set' });
    }
    
    if (req.user.secretPin !== pin) {
      return res.status(401).json({ message: 'Invalid PIN' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { protect, verifyPin };