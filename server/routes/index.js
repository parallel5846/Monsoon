import express from 'express';
import authRoutes from './auth.js';
import messageRoutes from './messages.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API 🫱🏻‍🫲🏻' });
});

// Auth routes
router.use('/api/auth', authRoutes);

// Message routes
router.use('/api/messages', messageRoutes);

export default router;