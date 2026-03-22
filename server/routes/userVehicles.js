const express = require('express');
const router = express.Router();
const userVehicleController = require('../controllers/userVehicleController');
const auth = require('../middleware/auth');

router.post('/', auth, userVehicleController.createVehicle);
router.get('/my-vehicles', auth, userVehicleController.getUserVehicles);
router.put('/:vehicleId', auth, userVehicleController.updateVehicle);
router.delete('/:vehicleId', auth, userVehicleController.deleteVehicle);
router.patch('/:vehicleId/availability', auth, userVehicleController.updateVehicleAvailability);

module.exports = router;
