const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

router.get('/', pharmacyController.getAllPharmacies);
router.post('/', pharmacyController.createPharmacy);
router.put('/:id', pharmacyController.updatePharmacy);
router.delete('/:id', pharmacyController.deletePharmacy);

module.exports = router;
