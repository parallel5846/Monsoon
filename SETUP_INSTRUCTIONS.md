# Setup Instructions - Password History Authentication System

This document provides step-by-step instructions to set up and run the complete authentication system with password history management.

## System Architecture

```
Frontend (React/Vite)
    ↓
Registration/Login/ResetPass Components
    ↓
API Requests (https://monsoon-jqgy.onrender.com)
    ↓
Express Server
    ↓
MongoDB Database
    ↓
Password History Array Storage
```

## Prerequisites

- **Node.js**: v14 or higher
- **MongoDB**: Local instance or MongoDB Atlas account
- **npm**: Comes with Node.js
- **Git** (optional)

## Installation Steps

### 1. Install Server Dependencies

```bash
cd server
npm install
```

This will install:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcrypt` - Password hashing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables

### 2. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition from:
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Use it in `.env` file

### 3. Configure Environment Variables

Create `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/dummy-project
PORT=3000
NODE_ENV=development
```

Or for MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dummy-project
PORT=3000
NODE_ENV=development
```

### 4. Install Frontend Dependencies

```bash
cd ..
npm install
```

### 5. Update API Endpoint (if needed)

If your server is running on a different port/host, update the API URLs in:
- `src/pages/Auth/Registration.jsx`
- `src/pages/Auth/Login.jsx`
- `src/pages/Auth/ResetPass.jsx`

Change:
```javascript
"https://monsoon-jqgy.onrender.com/api/auth/..."
```

To your actual server URL.

## Running the Application

### Terminal 1: Start the Server

```bash
cd server
npm start
```

Expected output:
```
✓ MongoDB connected successfully
✓ Database: dummy-project
✓ Host: localhost
Server listening on https://monsoon-jqgy.onrender.com
```

### Terminal 2: Start the Frontend

```bash
npm run dev
```

Expected output:
```
  VITE v7.2.4
  ➜  Local:   http://localhost:5173/
```

### Access the Application

Open your browser and go to: `http://localhost:5173/`

## Testing the System

### 1. Register a New User

1. Go to `http://localhost:5173/register`
2. Enter:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `SecurePass123!`
3. Click "Create Account"
4. You should see success message and redirect to login

### 2. Login with Registered User

1. Go to `http://localhost:5173/`
2. Enter:
   - Email: `john@example.com`
   - Password: `SecurePass123!`
3. Click "Login"
4. You should see success message (currently redirects to /home which doesn't exist)

### 3. Reset Password

1. Go to `http://localhost:5173/reset`
2. Enter:
   - Email: `john@example.com`
   - Old Password: `SecurePass123!` (original password)
   - New Password: `NewSecurePass456!`
3. Click "Reset Password"
4. Now you can login with the new password
5. The old password can still be used to reset again

## Password History Feature

Passwords are stored in an array format:

**Example after registration:**
```javascript
passwords: ["hashed_password_1"]
```

**After first password reset:**
```javascript
passwords: ["hashed_password_1", "hashed_password_2"]
```

**After second password reset:**
```javascript
passwords: ["hashed_password_1", "hashed_password_2", "hashed_password_3"]
```

- **Current password** = Last element in array
- **Old passwords** = All previous elements
- You can reset using ANY password in the history

## Database Structure

### MongoDB Collections

**Collection: users**

```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  passwords: [
    "$2b$10$hashedPassword1...",
    "$2b$10$hashedPassword2..."
  ],
  createdAt: ISODate("2026-04-19T..."),
  updatedAt: ISODate("2026-04-19T...")
}
```

## API Reference

### Register
```
POST https://monsoon-jqgy.onrender.com/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Login
```
POST https://monsoon-jqgy.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Reset Password
```
POST https://monsoon-jqgy.onrender.com/api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "oldPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

### Check Password History
```
GET https://monsoon-jqgy.onrender.com/api/password-history/:userId
```

## File Structure

```
project/
├── server/
│   ├── models/
│   │   └── User.js                 # User schema with password array
│   ├── routes/
│   │   ├── index.js                # Main routes
│   │   └── auth.js                 # Authentication routes
│   ├── middleware/
│   │   └── errorHandler.js         # Error handling middleware
│   ├── utils/
│   │   └── passwordUtils.js        # Password hashing utilities
│   ├── config/
│   │   └── database.js             # MongoDB connection
│   ├── server.js                   # Express app setup
│   ├── package.json                # Server dependencies
│   ├── .env.example                # Environment variables template
│   └── README.md                   # Server documentation
│
├── src/
│   ├── pages/Auth/
│   │   ├── Login.jsx               # Login component (updated with API)
│   │   ├── Registration.jsx        # Registration component (updated with API)
│   │   ├── ResetPass.jsx           # Reset password component (updated with API)
│   │   └── Auth.css                # Authentication styles (enhanced)
│   ├── App.jsx
│   ├── App.css                     # Global app styles (new)
│   └── index.css                   # Global styles (enhanced)
│
└── package.json                    # Frontend dependencies
```

## Troubleshooting

### MongoDB Connection Error
```
✗ MongoDB connection error: connect ECONNREFUSED
```
- Make sure MongoDB is running
- Check MONGODB_URI in `.env` file
- For MongoDB Atlas, verify username and password in connection string

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
- Make sure server is running on https://monsoon-jqgy.onrender.com
- Check that CORS is enabled in server.js
- Verify frontend is making requests to correct API URL

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
- Change PORT in `.env` file
- Or kill process using port 3000
- Update API URL in frontend components accordingly

### Dependencies Installation Failed
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Or use `npm install --legacy-peer-deps`

## Next Steps

1. **Add JWT Authentication**: Implement JWT tokens for secure session management
2. **Add Password Validation**: Implement password strength requirements
3. **Add Email Verification**: Send verification emails for new registrations
4. **Add Rate Limiting**: Prevent brute force attacks
5. **Add Logging**: Implement comprehensive logging system
6. **Add Tests**: Create unit and integration tests
7. **Deploy**: Deploy to production (Vercel, Heroku, etc.)

## Security Best Practices

- ✓ Passwords hashed with bcrypt (10 salt rounds)
- ✓ Email uniqueness enforced
- ✓ CORS enabled for frontend-backend communication
- ✓ MongoDB Atlas supports encryption
- TODO: Add HTTPS for production
- TODO: Add JWT tokens
- TODO: Add password complexity requirements
- TODO: Add rate limiting
- TODO: Add CSRF protection

## Support

For issues or questions:
1. Check error messages in browser console
2. Check server terminal logs
3. Verify MongoDB is running and accessible
4. Check `.env` file configuration
5. Review API endpoint URLs in components
