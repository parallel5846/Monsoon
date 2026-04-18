import crypto from 'crypto';
import bcrypt from 'bcrypt';

const SECRET_KEY = process.env.MESSAGE_SECRET || 'monsoon-message-secret-key-2026-abc!';
const KEY = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').slice(0, 32);
const IV_LENGTH = 16;

export const encryptText = (plainText) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(KEY), iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

export const decryptText = (encryptedText) => {
  if (!encryptedText || typeof encryptedText !== 'string') {
    return '';
  }

  const [ivHex, encrypted] = encryptedText.split(':');
  if (!ivHex || !encrypted) {
    return '';
  }

  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(KEY), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const hashMessage = async (message) => {
  return bcrypt.hash(message, 10);
};

export const verifyMessageHash = async (message, hash) => {
  return bcrypt.compare(message, hash);
};

export default {
  encryptText,
  decryptText,
  hashMessage,
  verifyMessageHash,
};
