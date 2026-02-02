# AMS Backend

Smart Municipal Asset Management System - Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ams_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Make sure MongoDB is running

4. Start the server:
```bash
npm run dev
```

## Default Admin Credentials

- Email: admin@asset.gov
- Password: Admin@123

Note: You need to create the admin user manually in the database or use a seed script.

