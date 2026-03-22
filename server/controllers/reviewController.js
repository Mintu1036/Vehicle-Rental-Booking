const { query } = require('../config/db');

const reviewController = {
  async createReview(req, res) {
    try {
      const { userId, vehicleId, rating, comment } = req.body;

      if (!userId || !vehicleId || !rating) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide userId, vehicleId, and rating' 
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
          success: false, 
          message: 'Rating must be between 1 and 5' 
        });
      }

      const existingReview = await query(
        'SELECT * FROM REVIEW WHERE UserID = ? AND VehicleID = ?',
        [userId, vehicleId]
      );

      if (existingReview.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'You have already reviewed this vehicle' 
        });
      }

      const result = await query(
        `INSERT INTO REVIEW (UserID, VehicleID, Rating, Comment) 
         VALUES (?, ?, ?, ?)`,
        [userId, vehicleId, rating, comment]
      );

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: {
          reviewId: result.insertId,
          userId,
          vehicleId,
          rating,
          comment
        }
      });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async getVehicleReviews(req, res) {
    try {
      const { vehicleId } = req.params;
      
      const reviews = await query(`
        SELECT r.*, u.FirstName, u.LastName 
        FROM REVIEW r
        JOIN USER u ON r.UserID = u.UserID
        WHERE r.VehicleID = ?
        ORDER BY r.ReviewDate DESC
      `, [vehicleId]);

      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('Get vehicle reviews error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async getUserReviews(req, res) {
    try {
      const { userId } = req.params;
      
      const reviews = await query(`
        SELECT r.*, v.VehicleName, v.Brand, v.Model, v.VehicleType,
               (SELECT ImageURL FROM VEHICLE_IMAGE WHERE VehicleID = v.VehicleID LIMIT 1) as VehicleImage
        FROM REVIEW r
        JOIN VEHICLE v ON r.VehicleID = v.VehicleID
        WHERE r.UserID = ?
        ORDER BY r.ReviewDate DESC
      `, [userId]);

      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('Get user reviews error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
};

module.exports = reviewController;
