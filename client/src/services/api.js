import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
}

export const vehicleAPI = {
  getAll: () => api.get('/vehicles'),
  getById: (id) => api.get(`/vehicles/${id}`),
  filter: (params) => api.get('/vehicles/filter', { params }),
}

export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
  updateStatus: (bookingId, status) => api.put(`/bookings/${bookingId}/status`, { status }),
}

export const paymentAPI = {
  create: (paymentData) => api.post('/payments', paymentData),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
}

export const reviewAPI = {
  create: (reviewData) => api.post('/reviews', reviewData),
  getVehicleReviews: (vehicleId) => api.get(`/reviews/vehicle/${vehicleId}`),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
}

export const userVehicleAPI = {
  createVehicle: (vehicleData) => api.post('/user-vehicles', vehicleData),
  getUserVehicles: () => api.get('/user-vehicles/my-vehicles'),
  updateVehicle: (vehicleId, vehicleData) => api.put(`/user-vehicles/${vehicleId}`, vehicleData),
  deleteVehicle: (vehicleId) => api.delete(`/user-vehicles/${vehicleId}`),
  updateAvailability: (vehicleId, availabilityStatus) => 
    api.patch(`/user-vehicles/${vehicleId}/availability`, { availabilityStatus })
}

export default api
