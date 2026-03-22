# 🚀 Vehicle Rental Platform - Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

## 🗄️ Database Setup

### 1. Create Database
```sql
mysql -u root -p
CREATE DATABASE vehicle_rent;
EXIT;
```

### 2. Import Schema
```bash
mysql -u root -p vehicle_rent < database_schema.sql
```

### 3. Verify Database Connection
Ensure your MySQL password matches the one in `server/.env`:
- Default password: `Abhi@1036`
- Update if needed in both MySQL and `.env` file

## 🛠️ Installation Steps

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Install All Project Dependencies
```bash
npm run install-all
```

Or install manually:

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
```

## 🚀 Running the Application

### Method 1: Run Both Concurrently (Recommended)
```bash
npm run dev
```

### Method 2: Run Separately

#### Start Backend Server
```bash
npm run server
```
Server will run on: `http://localhost:5000`

#### Start Frontend Development Server
```bash
npm run client
```
Frontend will run on: `http://localhost:5173`

## 🔗 Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📊 Database Configuration

The application uses the following database configuration:

```javascript
// server/config/db.js
{
  host: 'localhost',
  user: 'root',
  password: 'Abhi@1036',
  database: 'vehicle_rent'
}
```

### Update Database Credentials
If your MySQL credentials differ, update `server/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vehicle_rent
```

## 🧪 Testing the Application

### 1. Test Backend API
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Vehicle Rental API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Frontend
Open http://localhost:5173 in your browser and verify:
- Home page loads with vehicle listings
- Navigation works
- Filters function properly

### 3. Test Authentication
- Navigate to `/auth`
- Register a new user
- Login with the registered credentials
- Verify user session persistence

### 4. Test Booking Flow
- Browse vehicles
- Select a vehicle
- Complete booking process
- Verify booking appears in "My Bookings"

## 🔧 Common Issues & Solutions

### Database Connection Issues
```bash
Error: Access denied for user 'root'@'localhost'
```

**Solution**: Update MySQL password in `server/.env`

### Port Already in Use
```bash
Error: listen EADDRINUSE :::5000
```

**Solution**: Kill the process or change port in `server/.env`:
```env
PORT=5001
```

### Frontend Build Issues
```bash
Error: Unknown at rule @tailwind
```

**Solution**: Ensure Tailwind dependencies are installed:
```bash
cd client
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 📝 Available Scripts

### Root Level Scripts
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-all` - Install all dependencies

### Backend Scripts (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend Scripts (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `GET /api/vehicles/filter` - Filter vehicles

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/:id` - Get user bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/booking/:id` - Get payment by booking

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/vehicle/:id` - Get vehicle reviews
- `GET /api/reviews/user/:id` - Get user reviews

## 🎯 Next Steps

1. **Explore Features**: Browse the application and test all features
2. **Add More Data**: Insert sample vehicles and users
3. **Customize Styling**: Modify Tailwind CSS configurations
4. **Add New Features**: Implement additional functionality
5. **Deploy**: Prepare for production deployment

## 📞 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify database connection and credentials
3. Ensure all dependencies are properly installed
4. Check that ports are not blocked or in use

Happy coding! 🎉
