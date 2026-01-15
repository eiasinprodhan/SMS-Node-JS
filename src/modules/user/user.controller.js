const User = require('../auth/auth.model');
const File = require('../file/file.model');
const Folder = require('../folder/folder.model');
const fs = require('fs');
const path = require('path');

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verificationCode -resetCode');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set/Update Secret PIN
exports.setSecretPin = async (req, res) => {
  try {
    const { pin } = req.body;
    if (!/^\d{4,6}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be 4-6 digits' });
    }
    await User.findByIdAndUpdate(req.user._id, { secretPin: pin });
    res.json({ message: 'Secret PIN set successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    // Delete all user files from storage
    const files = await File.find({ user: req.user._id });
    files.forEach(file => {
      const filePath = path.join(__dirname, '../../../uploads', file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await File.deleteMany({ user: req.user._id });
    await Folder.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;