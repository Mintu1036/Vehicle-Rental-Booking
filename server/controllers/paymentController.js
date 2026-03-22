const { query } = require('../config/db');

const paymentController = {
  async createPayment(req, res) {
    try {
      const { bookingId, amount, paymentMethod } = req.body;

      if (!bookingId || !amount || !paymentMethod) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide bookingId, amount, and paymentMethod' 
        });
      }

      if (!['UPI', 'Card', 'Cash'].includes(paymentMethod)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid payment method' 
        });
      }

      const bookingCheck = await query(
        'SELECT * FROM BOOKING WHERE BookingID = ? AND BookingStatus = "Pending"',
        [bookingId]
      );

      if (bookingCheck.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid booking or booking already processed' 
        });
      }

      const result = await query(
        `INSERT INTO PAYMENT (BookingID, Amount, PaymentMethod, PaymentStatus) 
         VALUES (?, ?, ?, 'Completed')`,
        [bookingId, amount, paymentMethod]
      );

      await query(
        'UPDATE BOOKING SET BookingStatus = "Confirmed" WHERE BookingID = ?',
        [bookingId]
      );

      await query(`
        UPDATE VEHICLE 
        SET AvailabilityStatus = "Booked" 
        WHERE VehicleID = (SELECT VehicleID FROM BOOKING WHERE BookingID = ?)
      `, [bookingId]);

      res.status(201).json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          paymentId: result.insertId,
          bookingId,
          amount,
          paymentMethod,
          paymentStatus: 'Completed'
        }
      });
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async getPaymentByBooking(req, res) {
    try {
      const { bookingId } = req.params;
      
      const payments = await query(
        'SELECT * FROM PAYMENT WHERE BookingID = ? ORDER BY PaymentDate DESC',
        [bookingId]
      );

      res.status(200).json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Get payment error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
};

module.exports = paymentController;
