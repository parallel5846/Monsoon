import express from 'express';
import User from '../models/User.js';
import UserMsg from '../models/UserMsg.js';
import { encryptText, decryptText, hashMessage } from '../utils/encryption.js';

const router = express.Router();

const getChatId = (a, b) => [a.toLowerCase(), b.toLowerCase()].sort().join('_');

router.get('/chats/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const chats = await UserMsg.find({ participants: username }).lean();

    const preview = chats.map((chat) => {
      const otherUser = chat.participants.find((name) => name !== username) || username;
      const lastMessage = chat.messages[chat.messages.length - 1];
      return {
        chatId: chat.chatId,
        profileName: otherUser,
        username: otherUser,
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser)}`,
        lastMessage: lastMessage ? decryptText(lastMessage.encryptedText) : 'No messages yet',
        unreadCount: chat.messages.filter((message) => message.receiver === username && !message.read).length,
        lastMessageTime: lastMessage ? lastMessage.timestamp : chat.updatedAt,
      };
    });

    return res.status(200).json({ success: true, chats: preview });
  } catch (error) {
    console.error('Fetch chats error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching chats', error: error.message });
  }
});

router.get('/users/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const users = await User.find({ username: { $ne: username } }).lean();

    const result = users.map((user) => ({
      username: user.username,
      name: user.name,
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}`,
    }));

    return res.status(200).json({ success: true, users: result });
  } catch (error) {
    console.error('Fetch users error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching users', error: error.message });
  }
});

router.get('/conversation/:chatId/:username', async (req, res) => {
  try {
    const { chatId, username } = req.params;
    const chat = await UserMsg.findOne({ chatId });
    if (!chat) {
      return res.status(200).json({ success: true, chatId, messages: [] });
    }

    const decryptedMessages = chat.messages.map((message) => ({
      sender: message.sender,
      receiver: message.receiver,
      content: decryptText(message.encryptedText),
      timestamp: message.timestamp,
      read: message.read,
    }));

    await UserMsg.updateOne(
      { chatId },
      {
        $set: {
          'messages.$[elem].read': true,
        },
      },
      {
        arrayFilters: [{ 'elem.receiver': username, 'elem.read': false }],
        multi: true,
      }
    );

    return res.status(200).json({ success: true, chatId, messages: decryptedMessages });
  } catch (error) {
    console.error('Fetch conversation error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching conversation', error: error.message });
  }
});

router.post('/send', async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    if (!sender || !receiver || !content) {
      return res.status(400).json({ success: false, message: 'sender, receiver and content are required' });
    }

    const normalizedSender = sender.toLowerCase();
    const normalizedReceiver = receiver.toLowerCase();
    const chatId = getChatId(normalizedSender, normalizedReceiver);
    const encryptedText = encryptText(content);
    const messageHash = await hashMessage(content);

    const messageObject = {
      sender: normalizedSender,
      receiver: normalizedReceiver,
      encryptedText,
      messageHash,
      timestamp: new Date(),
      read: false,
    };

    const updatedChat = await UserMsg.findOneAndUpdate(
      { chatId },
      {
        $set: { updatedAt: new Date() },
        $push: { messages: messageObject },
        $setOnInsert: { chatId, participants: [normalizedSender, normalizedReceiver].sort() },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const decryptedHistory = updatedChat.messages.map((message) => ({
      sender: message.sender,
      receiver: message.receiver,
      content: decryptText(message.encryptedText),
      timestamp: message.timestamp,
      read: message.read,
    }));

    return res.status(201).json({ success: true, chatId, messages: decryptedHistory });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ success: false, message: 'Server error sending message', error: error.message });
  }
});

export default router;
