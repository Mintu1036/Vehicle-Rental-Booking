import { Link } from 'react-router-dom'
import { MapPin, Star, Calendar } from 'lucide-react'

const VehicleCard = ({ vehicle }) => {
  const imageUrl = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images[0].ImageURL 
    : 'https://via.placeholder.com/400x300?text=No+Image'

  return (
    <div className="card overflow-hidden">
      <div className="relative">
        <img
          src={imageUrl}
          alt={`${vehicle.Make} ${vehicle.Model}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-primary-600">
          ${vehicle.PricePerDay}/day
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {vehicle.VehicleName}
            </h3>
            <p className="text-sm text-gray-600">{vehicle.Brand} {vehicle.Model} • {vehicle.VehicleType}</p>
          </div>
          {vehicle.AverageRating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {vehicle.AverageRating.toFixed(1)}
              </span>
              {vehicle.ReviewCount > 0 && (
                <span className="text-xs text-gray-500">({vehicle.ReviewCount})</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span>{vehicle.City}, {vehicle.State}</span>
        </div>
        
        {vehicle.Description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {vehicle.Description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-primary-600">
            ${vehicle.PricePerDay}
            <span className="text-sm font-normal text-gray-500">/day</span>
          </div>
          <Link
            to={`/vehicle/${vehicle.VehicleID}`}
            className="btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VehicleCard
