# Authentication Server with Password History

This is the backend server for the authentication system with password history management.

## Features

- **User Registration**: Create new user accounts with password stored in array format
- **Password History**: Passwords stored as arrays where the last element is the current password
- **Login**: Authenticate users with current password
- **Password Reset**: Reset password using any old password from history
- **Password History API**: Retrieve password history count

## Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/dummy-project
PORT=3000
NODE_ENV=development
```

### Running the Server

Start the development server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Routes

### Base URL
```
http://localhost:3000/api/auth
```

### 1. Register User
**POST** `/api/auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Login User
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. Reset Password
**POST** `/api/auth/reset-password`

Uses any password from history to create a new password.

Request body:
```json
{
  "email": "john@example.com",
  "oldPassword": "previousPassword123",
  "newPassword": "newSecurePassword456"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 4. Get Password History
**GET** `/api/auth/password-history/:userId`

Response:
```json
{
  "success": true,
  "passwordCount": 3,
  "oldPasswordCount": 2,
  "message": "User has 3 passwords in history"
}
```

## Password Storage

Passwords are stored in an array format:
```javascript
passwords: [
  "hashedPassword1",  // old password
  "hashedPassword2",  // old password
  "hashedPassword3"   // current password (last element)
]
```

The last element in the array is always the current password used for login.
All previous elements can be used to reset the password.

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwords: [String],  // Array of hashed passwords
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All API endpoints return error responses with appropriate HTTP status codes:

- `400`: Bad Request (missing required fields)
- `401`: Unauthorized (invalid password)
- `404`: Not Found (user not found)
- `409`: Conflict (user already exists)
- `500`: Server Error

## Security Notes

- Passwords are hashed using bcrypt (salt rounds: 10)
- Email addresses are unique and case-insensitive
- CORS is enabled for frontend communication
- Use HTTPS in production

## Frontend Integration

The frontend components (Registration, Login, ResetPass) make API calls to these endpoints:

```javascript
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password })
})
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
