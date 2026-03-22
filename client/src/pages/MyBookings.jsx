import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Calendar, MapPin, DollarSign, Car, Eye } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { bookingAPI } from '../services/api'

const MyBookings = () => {
  const { user, isAuthenticated } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    fetchBookings()
  }, [isAuthenticated])

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings(user.userId)
      setBookings(response.data.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      case 'Completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Please login to view your bookings
        </h2>
        <a href="/auth" className="btn-primary">
          Login
        </a>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage your vehicle rental bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No bookings yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by browsing our available vehicles
          </p>
          <a href="/" className="btn-primary">
            Browse Vehicles
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.BookingID} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/4">
                  <img
                    src={booking.VehicleImage || 'https://via.placeholder.com/300x200?text=Vehicle'}
                    alt={`${booking.VehicleName}`}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-3/4 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {booking.VehicleName}
                      </h3>
                      <p className="text-gray-600">
                        {booking.Brand} {booking.Model} • {booking.VehicleType}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.BookingStatus)}`}>
                      {booking.BookingStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p className="text-sm">Start Date</p>
                        <p className="font-medium">{new Date(booking.StartDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p className="text-sm">End Date</p>
                        <p className="font-medium">{new Date(booking.EndDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <div>
                        <p className="text-sm">Location</p>
                        <p className="font-medium">{booking.City}, {booking.State}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-primary-600" />
                      <span className="text-2xl font-bold text-primary-600">
                        ${booking.TotalPrice}
                      </span>
                      <span className="text-gray-600">total</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span>Booking ID: #{booking.BookingID}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings
