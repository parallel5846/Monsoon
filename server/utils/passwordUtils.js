import bcrypt from 'bcrypt';

/**
 * Password Utility Functions
 * Handles password hashing, comparison, and validation
 */

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

/**
 * Compare plain text password with hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
export const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error(`Error comparing passwords: ${error.message}`);
  }
};

/**
 * Validate password against multiple hashed passwords (for password history)
 * @param {string} plainPassword - Plain text password
 * @param {Array<string>} hashedPasswords - Array of hashed passwords
 * @returns {Promise<boolean>} True if password matches any in history
 */
export const validatePasswordInHistory = async (plainPassword, hashedPasswords) => {
  try {
    for (let hashedPassword of hashedPasswords) {
      const isValid = await comparePasswords(plainPassword, hashedPassword);
      if (isValid) {
        return true;
      }
    }
    return false;
  } catch (error) {
    throw new Error(`Error validating password in history: ${error.message}`);
  }
};

/**
 * Check password strength
 * @param {string} password - Password to validate
 * @returns {Object} Strength analysis object
 */
export const checkPasswordStrength = (password) => {
  const strength = {
    isWeak: true,
    score: 0,
    feedback: [],
  };

  if (password.length < 8) {
    strength.feedback.push('Password should be at least 8 characters long');
  } else {
    strength.score += 1;
  }

  if (!/[a-z]/.test(password)) {
    strength.feedback.push('Password should contain lowercase letters');
  } else {
    strength.score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    strength.feedback.push('Password should contain uppercase letters');
  } else {
    strength.score += 1;
  }

  if (!/[0-9]/.test(password)) {
    strength.feedback.push('Password should contain numbers');
  } else {
    strength.score += 1;
  }

  if (!/[!@#$%^&*]/.test(password)) {
    strength.feedback.push('Password should contain special characters (!@#$%^&*)');
  } else {
    strength.score += 1;
  }

  strength.isWeak = strength.score < 3;

  return strength;
};

export default {
  hashPassword,
  comparePasswords,
  validatePasswordInHistory,
  checkPasswordStrength,
};
