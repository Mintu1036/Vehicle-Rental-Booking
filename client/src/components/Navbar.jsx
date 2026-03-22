import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Car, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">VehicleRental</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActivePath('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/my-bookings"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActivePath('/my-bookings') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  My Bookings
                </Link>
                <Link
                  to="/my-vehicles"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActivePath('/my-vehicles') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  My Vehicles
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-primary"
              >
                Login / Register
              </Link>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActivePath('/') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/my-bookings"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActivePath('/my-bookings') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/my-vehicles"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActivePath('/my-vehicles') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Vehicles
                  </Link>
                </>
              )}

              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-700">
                    {user.firstName} {user.lastName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-3 py-2 text-sm text-primary-600 hover:text-primary-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
