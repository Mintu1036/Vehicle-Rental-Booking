const { query } = require('../config/db');

const bookingController = {
  async createBooking(req, res) {
    try {
      const { userId, vehicleId, startDate, endDate } = req.body;

      if (!userId || !vehicleId || !startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide all required fields' 
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        return res.status(400).json({ 
          success: false, 
          message: 'End date must be after start date' 
        });
      }

      const vehicleCheck = await query(
        'SELECT * FROM VEHICLE WHERE VehicleID = ? AND AvailabilityStatus = "Available"',
        [vehicleId]
      );
      
      if (vehicleCheck.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vehicle not available' 
        });
      }

      const conflictCheck = await query(`
        SELECT * FROM BOOKING 
        WHERE VehicleID = ? 
        AND BookingStatus IN ('Confirmed', 'Pending')
        AND ((StartDate <= ? AND EndDate >= ?) OR (StartDate <= ? AND EndDate >= ?))
      `, [vehicleId, endDate, startDate, startDate, endDate]);
      
      if (conflictCheck.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vehicle is already booked for these dates' 
        });
      }

      const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const totalPrice = vehicleCheck[0].PricePerDay * daysDiff;

      const result = await query(
        `INSERT INTO BOOKING (UserID, VehicleID, StartDate, EndDate, TotalPrice, BookingStatus) 
         VALUES (?, ?, ?, ?, ?, 'Pending')`,
        [userId, vehicleId, startDate, endDate, totalPrice]
      );

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
          bookingId: result.insertId,
          userId,
          vehicleId,
          startDate,
          endDate,
          totalPrice,
          bookingStatus: 'Pending'
        }
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async getUserBookings(req, res) {
    try {
      const { userId } = req.params;
      
      const bookings = await query(`
        SELECT b.*, v.VehicleName, v.Brand, v.Model, v.VehicleType, v.PricePerDay,
               l.City, l.State,
               (SELECT ImageURL FROM VEHICLE_IMAGE WHERE VehicleID = v.VehicleID LIMIT 1) as VehicleImage
        FROM BOOKING b
        JOIN VEHICLE v ON b.VehicleID = v.VehicleID
        LEFT JOIN LOCATION l ON v.LocationID = l.LocationID
        WHERE b.UserID = ?
        ORDER BY b.BookingDate DESC
      `, [userId]);

      res.status(200).json({
        success: true,
        data: bookings
      });
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async updateBookingStatus(req, res) {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      if (!['Confirmed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid booking status' 
        });
      }

      const result = await query(
        'UPDATE BOOKING SET BookingStatus = ? WHERE BookingID = ?',
        [status, bookingId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Booking not found' 
        });
      }

      if (status === 'Confirmed') {
        await query(`
          UPDATE VEHICLE 
          SET AvailabilityStatus = 'Booked' 
          WHERE VehicleID = (SELECT VehicleID FROM BOOKING WHERE BookingID = ?)
        `, [bookingId]);
      }

      res.status(200).json({
        success: true,
        message: 'Booking status updated successfully'
      });
    } catch (error) {
      console.error('Update booking status error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
};

module.exports = bookingController;
