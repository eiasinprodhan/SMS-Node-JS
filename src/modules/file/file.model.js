const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, enum: ['image', 'pdf', 'document'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  isFavorite: { type: Boolean, default: false },
  isSecret: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);