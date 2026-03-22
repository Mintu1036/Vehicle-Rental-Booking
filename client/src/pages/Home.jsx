import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Car } from 'lucide-react'
import VehicleCard from '../components/VehicleCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { vehicleAPI } from '../services/api'

const Home = () => {
  const [vehicles, setVehicles] = useState([])
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: '',
    vehicleType: '',
    minPrice: '',
    maxPrice: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [vehicles, filters, searchTerm])

  const fetchVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll()
      setVehicles(response.data.data)
      setFilteredVehicles(response.data.data)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = vehicles

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.Make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.Model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.VehicleType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.city) {
      filtered = filtered.filter(vehicle => vehicle.City === filters.city)
    }

    if (filters.vehicleType) {
      filtered = filtered.filter(vehicle => vehicle.VehicleType === filters.vehicleType)
    }

    if (filters.minPrice) {
      filtered = filtered.filter(vehicle => vehicle.PricePerDay >= parseFloat(filters.minPrice))
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(vehicle => vehicle.PricePerDay <= parseFloat(filters.maxPrice))
    }

    setFilteredVehicles(filtered)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      city: '',
      vehicleType: '',
      minPrice: '',
      maxPrice: ''
    })
    setSearchTerm('')
  }

  const cities = [...new Set(vehicles.map(v => v.City))].filter(Boolean)
  const vehicleTypes = ['Car', 'SUV', 'Truck', 'Motorcycle', 'Van']

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Find Your Perfect Vehicle
        </h1>
        <p className="text-lg text-gray-600">
          Browse through our wide selection of vehicles for rent
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            name="vehicleType"
            value={filters.vehicleType}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">All Types</option>
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <div className="flex space-x-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="input-field flex-1"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="input-field flex-1"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={clearFilters}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Available Vehicles ({filteredVehicles.length})
        </h2>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No vehicles found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.VehicleID} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
