import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
  },
  passwords: {
    type: [String],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Getter for current password (last element in passwords array)
userSchema.methods.getCurrentPassword = function () {
  return this.passwords[this.passwords.length - 1];
};

// Method to get all old passwords
userSchema.methods.getOldPasswords = function () {
  return this.passwords.slice(0, -1);
};

// Method to add new password to history
userSchema.methods.addPasswordToHistory = function (newPassword) {
  this.passwords.push(newPassword);
  this.updatedAt = new Date();
};

const User = mongoose.model('User', userSchema);

export default User;
