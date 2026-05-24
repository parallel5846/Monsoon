import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validation
    if (!name || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, username, and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with password in array (first entry is current password)
    const newUser = new User({
      name,
      username,
      email,
      passwords: [hashedPassword],
    });

    await newUser.save();

    return res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify password against current password
    const currentPassword = user.getCurrentPassword();
    const isPasswordValid = await bcrypt.compare(password, currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

// Profile Route
router.get('/profile/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const safeUsername = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await User.findOne({ username: new RegExp(`^${safeUsername}$`, 'i') }).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email || '',
      },
    });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message,
    });
  }
});

// Reset Password Route (using old password)
router.post('/reset-password', async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Validation
    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, old password, and new password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify old password against any password in history
    let isOldPasswordValid = false;
    for (let hashedPassword of user.passwords) {
      const isValid = await bcrypt.compare(oldPassword, hashedPassword);
      if (isValid) {
        isOldPasswordValid = true;
        break;
      }
    }

    if (!isOldPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password provided' 
      });
    }

    // Hash new password and add to history
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.addPasswordToHistory(hashedNewPassword);
    await user.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during password reset',
      error: error.message 
    });
  }
});

// Get User Password History (protected route - for verification)
router.get('/password-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      passwordCount: user.passwords.length,
      oldPasswordCount: user.getOldPasswords().length,
      message: `User has ${user.passwords.length} passwords in history`
    });
  } catch (error) {
    console.error('Error fetching password history:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;
