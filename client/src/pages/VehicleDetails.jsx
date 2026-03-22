import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MapPin, Star, Calendar, DollarSign, ChevronLeft, ChevronRight, User } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { vehicleAPI, reviewAPI } from '../services/api'

const VehicleDetails = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    fetchVehicleDetails()
  }, [id])

  const fetchVehicleDetails = async () => {
    try {
      const response = await vehicleAPI.getById(id)
      setVehicle(response.data.data)
    } catch (error) {
      console.error('Error fetching vehicle details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    navigate(`/booking/${id}`)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      await reviewAPI.create({
        userId: user.userId,
        vehicleId: parseInt(id),
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      setReviewData({ rating: 5, comment: '' })
      setShowReviewForm(false)
      fetchVehicleDetails()
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const nextImage = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length)
    }
  }

  const prevImage = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Vehicle not found
        </h2>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  const currentImage = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images[currentImageIndex].ImageURL 
    : 'https://via.placeholder.com/600x400?text=No+Image'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Vehicles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative">
            <img
              src={currentImage}
              alt={`${vehicle.Make} ${vehicle.Model}`}
              className="w-full h-96 object-cover rounded-lg"
            />
            {vehicle.images && vehicle.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {vehicle.images && vehicle.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.ImageURL}
                    alt={`${vehicle.Make} ${vehicle.Model} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {vehicle.VehicleName}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600 mb-4">
              <span className="text-lg">{vehicle.Brand} {vehicle.Model}</span>
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {vehicle.VehicleType}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {vehicle.FuelType}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {vehicle.TransmissionType}
              </span>
              {vehicle.AverageRating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{vehicle.AverageRating.toFixed(1)}</span>
                  <span className="text-sm">({vehicle.ReviewCount} reviews)</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span>{vehicle.City}, {vehicle.State}</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-primary-600">
                ${vehicle.PricePerDay}
              </span>
              <span className="text-gray-600">per day</span>
            </div>
            <button
              onClick={handleBooking}
              className="w-full btn-primary py-3 text-lg"
            >
              Book Now
            </button>
          </div>

          {vehicle.Description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{vehicle.Description}</p>
            </div>
          )}

          {vehicle.OwnerFirstName && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">Vehicle Owner</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">
                  {vehicle.OwnerFirstName} {vehicle.OwnerLastName}
                </p>
                <p className="text-sm text-gray-600">{vehicle.OwnerEmail}</p>
                {vehicle.OwnerPhone && (
                  <p className="text-sm text-gray-600">{vehicle.OwnerPhone}</p>
                )}
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Verified Owner
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Registration Number</span>
              </div>
              <p className="font-semibold">{vehicle.RegistrationNumber}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Status</span>
              </div>
              <p className="font-semibold text-green-600">{vehicle.AvailabilityStatus}</p>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-secondary"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="input-field"
                  placeholder="Share your experience with this vehicle..."
                />
              </div>
              <button type="submit" className="btn-primary">
                Submit Review
              </button>
            </form>
          </div>
        )}

        {vehicle.reviews && vehicle.reviews.length > 0 ? (
          <div className="space-y-4">
            {vehicle.reviews.map((review) => (
              <div key={review.ReviewID} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-200 p-2 rounded-full">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {review.FirstName} {review.LastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.ReviewDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.Rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.Comment && (
                  <p className="text-gray-600">{review.Comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet. Be the first to review this vehicle!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VehicleDetails
