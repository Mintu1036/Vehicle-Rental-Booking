# 🚀 Quick Start Guide - Vehicle Rental Platform

## ✅ Issues Fixed
1. ✅ Frontend: Added missing `Calendar` import to LoginRegister component
2. ✅ Backend: Updated database name to match schema (`vehicle-rent`)

## 🗄️ Database Setup (Required)

The application needs the MySQL database to be created first:

### Option 1: Using MySQL Command Line
```bash
# Open MySQL
mysql -u root -p

# Create database and import schema
CREATE DATABASE IF NOT EXISTS `vehicle-rent`;
USE `vehicle-rent`;
SOURCE "c:\Users\Mintu\OneDrive\Desktop\My Projects\vehicle rental booking platform\database_schema.sql";
```

### Option 2: Using MySQL Workbench
1. Open MySQL Workbench
2. Create new database named `vehicle-rent`
3. Import the `database_schema.sql` file

## 🚀 Start the Application

### Backend Server (Terminal 1)
```bash
cd "c:\Users\Mintu\OneDrive\Desktop\My Projects\vehicle rental booking platform\server"
npm run dev
```

### Frontend Server (Terminal 2)
```bash
cd "c:\Users\Mintu\OneDrive\Desktop\My Projects\vehicle rental booking platform\client"
npm run dev
```

## 🌐 Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔍 Test the API
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test vehicles endpoint (after database setup)
curl http://localhost:5000/api/vehicles
```

## 🐛 Troubleshooting

### If you get "Unknown database 'vehicle-rent'" error:
1. Make sure MySQL is running
2. Create the database as shown above
3. Restart the backend server

### If frontend shows errors:
1. Check browser console for specific errors
2. Make sure both servers are running
3. Verify database connection

## 📝 Sample Data
The schema includes sample vehicles, locations, and images for testing.

## 🎯 Next Steps
1. Set up the database
2. Start both servers
3. Open http://localhost:5173 in your browser
4. Register a new user account
5. Browse and book vehicles!
