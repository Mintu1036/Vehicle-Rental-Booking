import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Car, MapPin, DollarSign, Settings, Eye, Edit, Trash2, Power, PowerOff, Plus, Star, Calendar } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { userVehicleAPI } from '../services/api'

const MyVehicles = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    
    fetchUserVehicles()
  }, [isAuthenticated, navigate])

  const fetchUserVehicles = async () => {
    try {
      const response = await userVehicleAPI.getUserVehicles()
      
      if (response.data.success) {
        setVehicles(response.data.data)
      }
    } catch (error) {
      console.error('Fetch user vehicles error:', error)
      setError('Failed to load your vehicles')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVehicle = async (vehicleId) => {
    if (!confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      return
    }

    try {
      await userVehicleAPI.deleteVehicle(vehicleId)
      setSuccess('Vehicle deleted successfully')
      fetchUserVehicles()
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Delete vehicle error:', error)
      setError(error.response?.data?.message || 'Failed to delete vehicle')
      
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleToggleAvailability = async (vehicleId, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Maintenance' : 'Available'
    
    try {
      await userVehicleAPI.updateAvailability(vehicleId, newStatus)
      setSuccess(`Vehicle availability updated to ${newStatus}`)
      fetchUserVehicles()
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Update availability error:', error)
      setError('Failed to update vehicle availability')
      
      setTimeout(() => setError(''), 3000)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'Booked':
        return 'bg-blue-100 text-blue-800'
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Vehicles</h1>
            <p className="text-gray-600 mt-1">Manage your vehicle listings</p>
          </div>
          <button
            onClick={() => navigate('/add-vehicle')}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Vehicle
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No vehicles listed yet</h3>
            <p className="text-gray-600 mb-6">Start earning money by listing your first vehicle</p>
            <button
              onClick={() => navigate('/add-vehicle')}
              className="btn-primary"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.VehicleID} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={vehicle.images && vehicle.images.length > 0 
                      ? vehicle.images[0].ImageURL 
                      : 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={vehicle.VehicleName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.AvailabilityStatus)}`}>
                      {vehicle.AvailabilityStatus}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {vehicle.VehicleName}
                    </h3>
                    <p className="text-gray-600">
                      {vehicle.Brand} {vehicle.Model} • {vehicle.VehicleType}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-medium text-gray-800">${vehicle.PricePerDay}/day</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{vehicle.City}, {vehicle.State}</span>
                    </div>
                    {vehicle.AverageRating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{vehicle.AverageRating.toFixed(1)} ({vehicle.ReviewCount} reviews)</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{vehicle.BookingCount} bookings</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/vehicle/${vehicle.VehicleID}`)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/edit-vehicle/${vehicle.VehicleID}`)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleAvailability(vehicle.VehicleID, vehicle.AvailabilityStatus)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title={vehicle.AvailabilityStatus === 'Available' ? 'Set to Maintenance' : 'Set to Available'}
                      >
                        {vehicle.AvailabilityStatus === 'Available' ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.VehicleID)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyVehicles
