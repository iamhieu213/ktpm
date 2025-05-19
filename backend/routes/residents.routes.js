'use strict'

const express = require('express')
const router = express.Router()

const ResidentsControllers = require('../controllers/residents.controllers');

router.get('/',ResidentsControllers.getAllResidents);
router
    .route('/:id')
    .get(ResidentsControllers.findResidentById)
    //.put(ResidentsControllers.updateResident)
    //.delete(ResidentsControllers.deleteResidentById)
router.post('/create-residents',ResidentsControllers.createResident);
router.put('/:id_card_number',ResidentsControllers.updateResident);
router.delete('/:id_card_number',ResidentsControllers.deleteResidentById)

module.exports = router;