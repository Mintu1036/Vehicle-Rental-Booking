import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Car, MapPin, DollarSign, Settings, Image as ImageIcon, Plus, X, Check } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { userVehicleAPI } from '../services/api'

const AddVehicle = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [locations, setLocations] = useState([])
  
  const [vehicleData, setVehicleData] = useState({
    vehicleName: '',
    brand: '',
    model: '',
    vehicleType: 'Sedan',
    fuelType: 'Petrol',
    transmissionType: 'Manual',
    pricePerDay: '',
    registrationNumber: '',
    locationId: '',
    description: '',
    images: []
  })

  const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Motorcycle', 'Van', 'Coupe', 'Convertible']
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid']
  const transmissionTypes = ['Manual', 'Automatic']

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    
    fetchLocations()
  }, [isAuthenticated, navigate])

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles')
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        const uniqueLocations = [...new Map(data.data.map(v => [v.LocationID, v])).values()]
        setLocations(uniqueLocations)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setVehicleData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageAdd = () => {
    const newImageUrl = prompt('Enter image URL:')
    if (newImageUrl) {
      setVehicleData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl]
      }))
    }
  }

  const handleImageRemove = (index) => {
    setVehicleData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await userVehicleAPI.createVehicle(vehicleData)
      
      if (response.data.success) {
        setSuccess('Vehicle submitted successfully! It will be available for booking once approved.')
        
        setTimeout(() => {
          navigate('/my-vehicles')
        }, 2000)
      }
    } catch (error) {
      console.error('Add vehicle error:', error)
      setError(error.response?.data?.message || 'Failed to add vehicle. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">List Your Vehicle</h1>
              <p className="text-gray-600 mt-1">Share your vehicle with others and earn money</p>
            </div>
            <Car className="h-8 w-8 text-primary-600" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <Check className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Name *
                </label>
                <input
                  type="text"
                  name="vehicleName"
                  value={vehicleData.vehicleName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Toyota Camry 2022"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={vehicleData.brand}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Toyota"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={vehicleData.model}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Camry"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={vehicleData.registrationNumber}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., ABC-1234"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  name="vehicleType"
                  value={vehicleData.vehicleType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type *
                </label>
                <select
                  name="fuelType"
                  value={vehicleData.fuelType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission *
                </label>
                <select
                  name="transmissionType"
                  value={vehicleData.transmissionType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {transmissionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Price ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="pricePerDay"
                    value={vehicleData.pricePerDay}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="45.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <select
                  name="locationId"
                  value={vehicleData.locationId}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select a location (optional)</option>
                  {locations.map(location => (
                    <option key={location.LocationID} value={location.LocationID}>
                      {location.City}, {location.State}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={vehicleData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  rows={4}
                  placeholder="Describe your vehicle, features, condition, etc."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-1" />
                  Vehicle Images
                </label>
                
                <div className="space-y-3">
                  {vehicleData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img
                        src={image}
                        alt={`Vehicle image ${index + 1}`}
                        className="h-16 w-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x64?text=Error'
                        }}
                      />
                      <span className="text-sm text-gray-600 flex-1 truncate">{image}</span>
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={handleImageAdd}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image URL
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/my-vehicles')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="small" /> : 'Submit Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddVehicle
