'use trict'

const express = require('express')
const router = express.Router();

const vehicleControllers = require('../controllers/vehicles.controllers');

router.get('/',vehicleControllers.getAllVehicle);
router.post('/createVehicle', vehicleControllers.createVehicle);
router
   .route('/:id')
       .delete(vehicleControllers.deleteVehicle)
       .get(vehicleControllers.getAllVehicleById)
       .put(vehicleControllers.updateVehicle)

module.exports = router;