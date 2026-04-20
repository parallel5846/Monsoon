# Monsoon - Password History Authentication System

A full-stack web application featuring an innovative password history authentication system that allows users to reset passwords using any previously used password.

## 🚀 Tech Stack

**Frontend:**
- React 19 with Vite
- React Router for navigation
- Modern glassmorphic UI design
- Responsive components

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- bcrypt for secure password hashing
- CORS enabled API

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## ✨ Key Features

- **Password History Management**: Store passwords as an array where the last element is current and previous elements are historical passwords
- **Flexible Password Reset**: Reset password using any password from history
- **Secure Authentication**: bcrypt hashing with salt rounds
- **Modern UI/UX**: Glassmorphic design with smooth animations
- **Real-time Feedback**: Loading states and success/error messages
- **Form Validation**: Client-side validation with server-side verification

## 🏗️ Architecture

```
Frontend (React/Vite) → API Calls → Express Server → MongoDB
                                      ↓
                            Password History Array
                            [old_pass_1, old_pass_2, current_pass]
```

## 📁 Project Structure

```
monsoon/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route components (Auth, Home)
│   └── context/           # React context providers
├── server/                # Express.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Error handling & validation
│   └── utils/            # Password utilities
└── public/               # Static assets
```

## 🔧 Quick Setup

1. **Install dependencies:**
   ```bash
   # Backend
   cd server && npm install
   # Frontend
   cd .. && npm install
   ```

2. **Configure MongoDB:**
   ```bash
   # Create server/.env
   MONGODB_URI=mongodb://localhost:27017/monsoon
   PORT=3000
   ```

3. **Start development servers:**
   ```bash
   # Terminal 1 - Backend
   cd server && npm start
   # Terminal 2 - Frontend
   npm run dev
   ```

4. **Visit:** `http://localhost:5173`

## 🎯 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/reset-password` - Password reset with history
- `GET /api/auth/password-history/:userId` - Get password history count

## 💡 Innovation

This project implements a unique password history system where:
- Passwords are stored in an array format
- Users can authenticate using any historical password
- Maintains security while providing flexibility
- Demonstrates advanced authentication patterns

## 📱 Live Demo

Frontend: [monsoon.vercel.app](https://monsoon.vercel.app)
Backend API: [monsoon-jqgy.onrender.com](https://monsoon-jqgy.onrender.com)

---

Built with modern web technologies and innovative authentication concepts.</content>
<parameter name="filePath">d:\Monsoon\README.md