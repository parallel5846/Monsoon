# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies

**Backend:**
```bash
cd server
npm install
cd ..
```

**Frontend:**
```bash
npm install
```

### Step 2: Configure MongoDB

Create `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/dummy-project
PORT=3000
NODE_ENV=development
```

**Make sure MongoDB is running:**
```bash
# On Windows
mongod

# On Mac (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 4: Open in Browser

```
http://localhost:5173/
```

## Testing the Features

### 1. Register
- Go to `/register`
- Fill in name, email, password
- Click "Create Account"

### 2. Login
- Use registered email and password
- Click "Login"

### 3. Reset Password
- Go to `/reset`
- Enter email, old password, new password
- Click "Reset Password"
- Old password can still be used to reset again!

## What Was Built

✅ **Password History System**
- Passwords stored as array
- Last element = current password
- Previous elements = old passwords
- Can reset using any old password

✅ **Authentication APIs**
- `/api/auth/register` - New users
- `/api/auth/login` - Login
- `/api/auth/reset-password` - Change password

✅ **MongoDB Integration**
- User model with password array
- Secure bcrypt hashing
- Unique email indexes

✅ **Enhanced UI**
- Modern glassmorphic design
- Success/error messages
- Loading states
- Form validation

## MongoDB Connection String Examples

**Local:**
```
mongodb://localhost:27017/dummy-project
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/dummy-project
```

## Common Issues

| Problem | Solution |
|---------|----------|
| MongoDB connection error | Check MongoDB is running with `mongod` |
| CORS error | Make sure server is on `localhost:3000` |
| Port 3000 already in use | Change PORT in `.env` file |
| npm install fails | Try `npm install --legacy-peer-deps` |

## Useful Commands

```bash
# Start server with auto-reload
npm start

# Start frontend dev server
npm run dev

# Build frontend for production
npm run build

# Check MongoDB
mongo  # (or mongosh on newer versions)

# View running processes
lsof -i :3000  # Check port 3000

# Kill process on port
kill -9 <PID>  # Replace <PID> with process ID
```

## File Locations

| Component | File |
|-----------|------|
| User Model | `server/models/User.js` |
| Auth API | `server/routes/auth.js` |
| Registration Form | `src/pages/Auth/Registration.jsx` |
| Login Form | `src/pages/Auth/Login.jsx` |
| Reset Password | `src/pages/Auth/ResetPass.jsx` |
| Auth Styles | `src/pages/Auth/Auth.css` |
| Global Styles | `src/index.css` |

## API Reference

**Register User:**
```bash
curl -X POST https://monsoon-jqgy.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"Pass123!"}'
```

**Login:**
```bash
curl -X POST https://monsoon-jqgy.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Pass123!"}'
```

**Reset Password:**
```bash
curl -X POST https://monsoon-jqgy.onrender.com/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","oldPassword":"Pass123!","newPassword":"NewPass456!"}'
```

## Next Steps

1. Test all features (register, login, reset password)
2. Check MongoDB for stored user data
3. Review API responses in browser DevTools
4. Build dashboard/home page for logged-in users
5. Add JWT tokens for session management
6. Deploy to production

---

**Ready to go!** 🚀
