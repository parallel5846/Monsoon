import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    lowercase: true,
  },
  receiver: {
    type: String,
    required: true,
    lowercase: true,
  },
  encryptedText: {
    type: String,
    required: true,
  },
  messageHash: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const userMsgSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  participants: {
    type: [String],
    required: true,
  },
  messages: {
    type: [messageSchema],
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

const UserMsg = mongoose.model('UserMsg', userMsgSchema);

export default UserMsg;
