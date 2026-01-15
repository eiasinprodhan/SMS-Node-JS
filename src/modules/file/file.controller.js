const File = require('./file.model');
const User = require('../auth/auth.model');
const fs = require('fs');
const path = require('path');

const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf') return 'pdf';
  return 'document';
};

// Upload File
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user._id);
    const newUsedStorage = user.usedStorage + req.file.size;

    if (newUsedStorage > user.storageLimit) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Storage limit exceeded' });
    }

    const file = await File.create({
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      type: getFileType(req.file.mimetype),
      user: req.user._id,
      folder: req.body.folder || null,
      isSecret: req.body.isSecret === 'true',
    });

    user.usedStorage = newUsedStorage;
    await user.save();

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Files
exports.getFiles = async (req, res) => {
  try {
    const { type, folder, favorite } = req.query;
    const query = { user: req.user._id, isSecret: false };
    
    if (type) query.type = type;
    if (folder) query.folder = folder;
    if (favorite === 'true') query.isFavorite = true;

    const files = await File.find(query).sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Secret Files
exports.getSecretFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id, isSecret: true });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Files by Date (Calendar)
exports.getFilesByDate = async (req, res) => {
  try {
    const { date } = req.query; // Format: YYYY-MM-DD
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const files = await File.find({
      user: req.user._id,
      isSecret: false,
      createdAt: { $gte: startDate, $lt: endDate },
    });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    file.isFavorite = !file.isFavorite;
    await file.save();
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete File
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Delete physical file
    const filePath = path.join(__dirname, '../../../uploads', file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Update used storage
    await User.findByIdAndUpdate(req.user._id, { $inc: { usedStorage: -file.size } });

    res.json({ message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download File
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '../../../uploads', file.filename);
    res.download(filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;