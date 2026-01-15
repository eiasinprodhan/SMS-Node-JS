const Folder = require('./folder.model');
const File = require('../file/file.model');

// Create Folder
exports.createFolder = async (req, res) => {
  try {
    const { name, parent, isSecret } = req.body;
    const folder = await Folder.create({
      name,
      user: req.user._id,
      parent: parent || null,
      isSecret: isSecret || false,
    });
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Folders
exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user._id, isSecret: false });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Secret Folders (requires PIN verification first)
exports.getSecretFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user._id, isSecret: true });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Folder
exports.updateFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name: req.body.name },
      { new: true }
    );
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Folder
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    
    // Delete all files in folder
    await File.deleteMany({ folder: req.params.id });
    res.json({ message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;