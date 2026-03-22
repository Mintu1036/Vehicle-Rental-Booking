const { query } = require('../config/db');

const vehicleController = {
  async getAllVehicles(req, res) {
    try {
      const sql = `
        SELECT v.*, l.City, l.State, l.Address, l.Pincode,
               u.FirstName as OwnerFirstName, u.LastName as OwnerLastName, u.Email as OwnerEmail,
               (SELECT AVG(Rating) FROM REVIEW WHERE VehicleID = v.VehicleID) as AverageRating,
               (SELECT COUNT(*) FROM REVIEW WHERE VehicleID = v.VehicleID) as ReviewCount
        FROM VEHICLE v
        LEFT JOIN LOCATION l ON v.LocationID = l.LocationID
        LEFT JOIN USER u ON v.OwnerID = u.UserID
        WHERE v.AvailabilityStatus = 'Available'
        ORDER BY v.CreatedAt DESC
      `;
      
      const vehicles = await query(sql);
      
      for (let vehicle of vehicles) {
        const images = await query(
          'SELECT ImageURL FROM VEHICLE_IMAGE WHERE VehicleID = ?',
          [vehicle.VehicleID]
        );
        vehicle.images = images;
      }

      res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error) {
      console.error('Get vehicles error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async getVehicleById(req, res) {
    try {
      const { id } = req.params;
      
      const vehicleSql = `
        SELECT v.*, l.City, l.State, l.Address, l.Pincode,
               u.FirstName as OwnerFirstName, u.LastName as OwnerLastName, u.Email as OwnerEmail, u.PhoneNumber as OwnerPhone,
               (SELECT AVG(Rating) FROM REVIEW WHERE VehicleID = v.VehicleID) as AverageRating,
               (SELECT COUNT(*) FROM REVIEW WHERE VehicleID = v.VehicleID) as ReviewCount
        FROM VEHICLE v
        LEFT JOIN LOCATION l ON v.LocationID = l.LocationID
        LEFT JOIN USER u ON v.OwnerID = u.UserID
        WHERE v.VehicleID = ?
      `;
      
      const vehicles = await query(vehicleSql, [id]);
      
      if (vehicles.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Vehicle not found' 
        });
      }

      const vehicle = vehicles[0];
      
      const images = await query(
        'SELECT ImageURL FROM VEHICLE_IMAGE WHERE VehicleID = ?',
        [id]
      );
      vehicle.images = images;

      const reviews = await query(`
        SELECT r.*, u.FirstName, u.LastName 
        FROM REVIEW r
        JOIN USER u ON r.UserID = u.UserID
        WHERE r.VehicleID = ?
        ORDER BY r.ReviewDate DESC
      `, [id]);
      
      vehicle.reviews = reviews;

      res.status(200).json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      console.error('Get vehicle error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async filterVehicles(req, res) {
    try {
      const { city, vehicleType, minPrice, maxPrice } = req.query;
      
      let sql = `
        SELECT v.*, l.City, l.State, l.Address, l.Pincode,
               u.FirstName as OwnerFirstName, u.LastName as OwnerLastName, u.Email as OwnerEmail,
               (SELECT AVG(Rating) FROM REVIEW WHERE VehicleID = v.VehicleID) as AverageRating,
               (SELECT COUNT(*) FROM REVIEW WHERE VehicleID = v.VehicleID) as ReviewCount
        FROM VEHICLE v
        LEFT JOIN LOCATION l ON v.LocationID = l.LocationID
        LEFT JOIN USER u ON v.OwnerID = u.UserID
        WHERE v.AvailabilityStatus = 'Available'
      `;
      
      const params = [];
      
      if (city) {
        sql += ' AND l.City = ?';
        params.push(city);
      }
      
      if (vehicleType) {
        sql += ' AND v.VehicleType = ?';
        params.push(vehicleType);
      }
      
      if (minPrice) {
        sql += ' AND v.PricePerDay >= ?';
        params.push(parseFloat(minPrice));
      }
      
      if (maxPrice) {
        sql += ' AND v.PricePerDay <= ?';
        params.push(parseFloat(maxPrice));
      }
      
      sql += ' ORDER BY v.PricePerDay ASC';
      
      const vehicles = await query(sql, params);
      
      for (let vehicle of vehicles) {
        const images = await query(
          'SELECT ImageURL FROM VEHICLE_IMAGE WHERE VehicleID = ?',
          [vehicle.VehicleID]
        );
        vehicle.images = images;
      }

      res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error) {
      console.error('Filter vehicles error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
};

module.exports = vehicleController;
