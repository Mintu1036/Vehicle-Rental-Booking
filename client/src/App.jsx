import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import VehicleDetails from './pages/VehicleDetails'
import Booking from './pages/Booking'
import LoginRegister from './pages/LoginRegister'
import MyBookings from './pages/MyBookings'
import MyVehicles from './pages/MyVehicles'
import AddVehicle from './pages/AddVehicle'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/booking/:vehicleId" element={<Booking />} />
            <Route path="/auth" element={<LoginRegister />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/my-vehicles" element={<MyVehicles />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
