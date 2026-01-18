const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationExpires: { type: Date },
  resetCode: { type: String },
  resetExpires: { type: Date },
  storageLimit: { type: Number, default: 16106127360 },
  usedStorage: { type: Number, default: 0 },
  secretPin: { type: String },
  avatar: { type: String }
}, { timestamps: true });


userSchema.pre('save', async function() {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);