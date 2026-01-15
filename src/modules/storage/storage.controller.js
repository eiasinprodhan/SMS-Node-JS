const File = require('../file/file.model');
const Folder = require('../folder/folder.model');
const User = require('../auth/auth.model');

// Get Storage Stats
exports.getStorageStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get file counts and sizes by type
    const fileStats = await File.aggregate([
      { $match: { user: req.user._id, isSecret: false } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' },
        },
      },
    ]);

    // Get folder count
    const folderCount = await Folder.countDocuments({ user: req.user._id, isSecret: false });

    // Get folders with their sizes
    const foldersWithSize = await File.aggregate([
      { $match: { user: req.user._id, folder: { $ne: null } } },
      {
        $group: {
          _id: '$folder',
          totalSize: { $sum: '$size' },
          fileCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'folders',
          localField: '_id',
          foreignField: '_id',
          as: 'folderInfo',
        },
      },
      { $unwind: '$folderInfo' },
      {
        $project: {
          name: '$folderInfo.name',
          totalSize: 1,
          fileCount: 1,
        },
      },
    ]);

    const stats = {
      storageLimit: user.storageLimit,
      usedStorage: user.usedStorage,
      availableStorage: user.storageLimit - user.usedStorage,
      usedPercentage: ((user.usedStorage / user.storageLimit) * 100).toFixed(2),
      totalFolders: folderCount,
      filesByType: fileStats,
      foldersWithSize,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Calendar Data
exports.getCalendarData = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const files = await File.aggregate([
      {
        $match: {
          user: req.user._id,
          isSecret: false,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          files: { $push: { name: '$originalName', type: '$type' } },
        },
      },
    ]);

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;