import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Calendar, DollarSign, MapPin, CreditCard, User, CheckCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { vehicleAPI, bookingAPI, paymentAPI } from '../services/api'

const Booking = () => {
  const { vehicleId } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: ''
  })
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState(null)
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'UPI'
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    fetchVehicle()
  }, [vehicleId, isAuthenticated, navigate])

  const fetchVehicle = async () => {
    try {
      const response = await vehicleAPI.getById(vehicleId)
      setVehicle(response.data.data)
    } catch (error) {
      console.error('Error fetching vehicle:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalPrice = () => {
    if (!bookingData.startDate || !bookingData.endDate || !vehicle) return 0
    
    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    
    return days > 0 ? days * vehicle.PricePerDay : 0
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    
    if (!bookingData.startDate || !bookingData.endDate) {
      alert('Please select both start and end dates')
      return
    }

    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    
    if (start >= end) {
      alert('End date must be after start date')
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (start < today) {
      alert('Start date cannot be in the past')
      return
    }

    setProcessing(true)
    try {
      const response = await bookingAPI.create({
        userId: user.userId,
        vehicleId: parseInt(vehicleId),
        startDate: bookingData.startDate,
        endDate: bookingData.endDate
      })
      
      setBooking(response.data.data)
      setStep(2)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setProcessing(false)
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    
    try {
      await paymentAPI.create({
        bookingId: booking.bookingId,
        amount: booking.totalPrice,
        paymentMethod: paymentData.paymentMethod
      })
      
      setStep(3)
    } catch (error) {
      console.error('Error processing payment:', error)
      alert(error.response?.data?.message || 'Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  const minDate = new Date().toISOString().split('T')[0]

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
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          1
        </div>
        <div className={`flex-1 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          2
        </div>
        <div className={`flex-1 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          3
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {step === 1 ? 'Select Dates' : step === 2 ? 'Payment' : 'Confirmation'}
        </h1>
        <p className="text-gray-600">
          {step === 1 && 'Choose your rental dates'}
          {step === 2 && 'Complete your payment'}
          {step === 3 && 'Booking confirmed!'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Rental Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                        min={minDate}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        End Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.endDate}
                        onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                        min={bookingData.startDate || minDate}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>

                {bookingData.startDate && bookingData.endDate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Price Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Daily Rate:</span>
                        <span>${vehicle.PricePerDay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Days:</span>
                        <span>{Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24))}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary-600">${calculateTotalPrice()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing || !bookingData.startDate || !bookingData.endDate}
                  className="w-full btn-primary py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processing ? <LoadingSpinner size="small" /> : 'Continue to Payment'}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CreditCard className="inline h-4 w-4 mr-1" />
                        Payment Method
                      </label>
                      <select
                        value={paymentData.paymentMethod}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                        className="input-field"
                      >
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> This is a simulated payment process. No actual charges will be made.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vehicle:</span>
                      <span>{vehicle.VehicleName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Period:</span>
                      <span>{bookingData.startDate} to {bookingData.endDate}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount:</span>
                      <span className="text-primary-600">${booking.totalPrice}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full btn-primary py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processing ? <LoadingSpinner size="small" /> : 'Complete Payment'}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">
                Your vehicle has been successfully booked. Check your email for confirmation details.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                <h4 className="font-semibold mb-2">Booking Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-mono">#{booking.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <span>{vehicle.VehicleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dates:</span>
                    <span>{bookingData.startDate} to {bookingData.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Paid:</span>
                    <span className="font-bold text-green-600">${booking.totalPrice}</span>
                  </div>
                </div>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="btn-primary"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="btn-secondary"
                >
                  Browse More Vehicles
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h4 className="font-semibold mb-2">Vehicle Information</h4>
            <div className="space-y-4">
              <img
                src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].ImageURL : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={`${vehicle.VehicleName}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-semibold text-lg">
                  {vehicle.VehicleName}
                </h4>
                <p className="text-gray-600">{vehicle.Brand} {vehicle.Model} • {vehicle.VehicleType}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{vehicle.City}, {vehicle.State}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">
                  ${vehicle.PricePerDay}
                </span>
                <span className="text-gray-600">per day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
