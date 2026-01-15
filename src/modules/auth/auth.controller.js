const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const { sendVerificationCode, sendResetCode } = require('../../utils/email');

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const code = generateCode();
    const user = await User.create({
      name,
      email,
      password,
      verificationCode: code,
      verificationExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendVerificationCode(email, code);
    res.status(201).json({ message: 'Verification code sent to email', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({ message: 'Email verified', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const code = generateCode();
    user.resetCode = code;
    user.resetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendResetCode(email, code);
    res.json({ message: 'Reset code sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    const user = await User.findOne({
      email,
      resetCode: code,
      resetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.password = newPassword;
    user.resetCode = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google Callback
exports.googleCallback = (req, res) => {
  const token = generateToken(req.user._id);
  res.json({ token, user: { id: req.user._id, name: req.user.name, email: req.user.email } });
};