# Vehicle Rental Booking Platform

A complete full-stack vehicle rental web application built with React, Node.js, Express, and MySQL.

## 🚀 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MySQL (mysql2 package)
- dotenv
- CORS

## 📁 Project Structure

```
vehicle-rental-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API calls
│   │   ├── context/       # Auth state
│   │   └── App.jsx        # Main App component
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── config/           # Database config
│   ├── package.json
│   └── server.js         # Server entry point
├── database_schema.sql    # MySQL database schema
└── README.md
```

## 🗄️ Database Setup

1. Create MySQL database named `vehicle_rent`
2. Run the database schema:
   ```sql
   mysql -u root -p vehicle_rent < database_schema.sql
   ```

## 🚀 Installation & Setup

1. Install dependencies for all projects:
   ```bash
   npm run install-all
   ```

2. Start both frontend and backend:
   ```bash
   npm run dev
   ```

3. Or start individually:
   ```bash
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

## 🔗 Access Points

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📊 Database Configuration

Database connection is configured in `server/config/db.js`:
- Host: localhost
- User: root
- Password: Abhi@1036
- Database: vehicle_rent

## 🛠️ Available Scripts

- `npm run dev` - Start both client and server
- `npm run server` - Start backend server only
- `npm run client` - Start frontend development server
- `npm run install-all` - Install dependencies for all projects

## 📋 Features

- User authentication (register/login)
- Vehicle browsing with filters
- Booking system with date selection
- Payment processing (simulated)
- Review and rating system
- Vehicle image gallery
- Responsive design

## 🔑 API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Vehicles
- GET /api/vehicles
- GET /api/vehicles/:id
- GET /api/vehicles/filter

### Bookings
- POST /api/bookings
- GET /api/bookings/user/:id

### Payments
- POST /api/payments

### Reviews
- POST /api/reviews
- GET /api/reviews/:vehicleId
"# Vehicle-Rental-Booking" 
