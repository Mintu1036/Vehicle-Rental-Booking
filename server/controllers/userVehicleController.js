const { query } = require('../config/db');

const userVehicleController = {
  async createVehicle(req, res) {
    try {
      const { 
        vehicleName, 
        brand, 
        model, 
        vehicleType, 
        fuelType, 
        transmissionType, 
        pricePerDay, 
        registrationNumber,
        locationId,
        description 
      } = req.body;

      const userId = req.user.id;

      if (!vehicleName || !brand || !model || !vehicleType || !fuelType || 
          !transmissionType || !pricePerDay || !registrationNumber) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide all required fields' 
        });
      }

      const regCheck = await query(
        'SELECT * FROM VEHICLE WHERE RegistrationNumber = ?', 
        [registrationNumber]
      );
      
      if (regCheck.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Registration number already exists' 
        });
      }

      const result = await query(
        `INSERT INTO VEHICLE (VehicleName, Brand, Model, VehicleType, FuelType, 
         TransmissionType, PricePerDay, RegistrationNumber, OwnerID, LocationID) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [vehicleName, brand, model, vehicleType, fuelType, transmissionType, 
         pricePerDay, registrationNumber, userId, locationId || null]
      );

      res.status(201).json({
        success: true,
        message: 'Vehicle submitted for approval. It will be available for booking once approved.',
        data: {
          vehicleId: result.insertId,
          vehicleName,
          brand,
          model,
          vehicleType,
          fuelType,
          transmissionType,
          pricePerDay,
          registrationNumber,
          ownerId: userId,
          availabilityStatus: 'Pending'
        }
      });
    } catch (error) {
      console.error('Create vehicle error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async getUserVehicles(req, res) {
    try {
      const userId = req.user.id;
      
      const vehicles = await query(`
        SELECT v.*, l.City, l.State, l.Address, l.Pincode,
               (SELECT AVG(Rating) FROM REVIEW WHERE VehicleID = v.VehicleID) as AverageRating,
               (SELECT COUNT(*) FROM REVIEW WHERE VehicleID = v.VehicleID) as ReviewCount,
               (SELECT COUNT(*) FROM BOOKING WHERE VehicleID = v.VehicleID) as BookingCount
        FROM VEHICLE v
        LEFT JOIN LOCATION l ON v.LocationID = l.LocationID
        WHERE v.OwnerID = ?
        ORDER BY v.CreatedAt DESC
      `, [userId]);

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
      console.error('Get user vehicles error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async updateVehicle(req, res) {
    try {
      const { vehicleId } = req.params;
      const userId = req.user.id;
      const { 
        vehicleName, 
        brand, 
        model, 
        vehicleType, 
        fuelType, 
        transmissionType, 
        pricePerDay, 
        locationId,
        description 
      } = req.body;

      const vehicleCheck = await query(
        'SELECT * FROM VEHICLE WHERE VehicleID = ? AND OwnerID = ?',
        [vehicleId, userId]
      );

      if (vehicleCheck.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Vehicle not found or you do not have permission to update it' 
        });
      }

      const result = await query(
        `UPDATE VEHICLE SET VehicleName = ?, Brand = ?, Model = ?, VehicleType = ?, 
         FuelType = ?, TransmissionType = ?, PricePerDay = ?, LocationID = ? 
         WHERE VehicleID = ?`,
        [vehicleName, brand, model, vehicleType, fuelType, transmissionType, 
         pricePerDay, locationId || null, vehicleId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Vehicle not found' 
        });
      }

      res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully'
      });
    } catch (error) {
      console.error('Update vehicle error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async deleteVehicle(req, res) {
    try {
      const { vehicleId } = req.params;
      const userId = req.user.id;

      const vehicleCheck = await query(
        'SELECT * FROM VEHICLE WHERE VehicleID = ? AND OwnerID = ?',
        [vehicleId, userId]
      );

      if (vehicleCheck.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Vehicle not found or you do not have permission to delete it' 
        });
      }

      const activeBookings = await query(
        'SELECT * FROM BOOKING WHERE VehicleID = ? AND BookingStatus IN ("Confirmed", "Pending")',
        [vehicleId]
      );

      if (activeBookings.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot delete vehicle with active bookings' 
        });
      }

      await query('DELETE FROM VEHICLE_IMAGE WHERE VehicleID = ?', [vehicleId]);
      await query('DELETE FROM VEHICLE WHERE VehicleID = ?', [vehicleId]);

      res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error) {
      console.error('Delete vehicle error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  async updateVehicleAvailability(req, res) {
    try {
      const { vehicleId } = req.params;
      const userId = req.user.id;
      const { availabilityStatus } = req.body;

      if (!['Available', 'Maintenance'].includes(availabilityStatus)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid availability status' 
        });
      }

      const vehicleCheck = await query(
        'SELECT * FROM VEHICLE WHERE VehicleID = ? AND OwnerID = ?',
        [vehicleId, userId]
      );

      if (vehicleCheck.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Vehicle not found or you do not have permission to update it' 
        });
      }

      const result = await query(
        'UPDATE VEHICLE SET AvailabilityStatus = ? WHERE VehicleID = ?',
        [availabilityStatus, vehicleId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Vehicle not found' 
        });
      }

      res.status(200).json({
        success: true,
        message: `Vehicle availability updated to ${availabilityStatus}`
      });
    } catch (error) {
      console.error('Update availability error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
};

module.exports = userVehicleController;
