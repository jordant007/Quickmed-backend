const express = require('express');
const router = express.Router();
const { 
  createPharmacy, 
  updatePharmacy, 
  findNearbyPharmacies 
} = require('../controllers/pharmacyController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/pharmacies
// @desc    Create a pharmacy
// @access  Private
router.post('/', authMiddleware, createPharmacy);

// @route   PUT /api/pharmacies/:id
// @desc    Update pharmacy details
// @access  Private
router.put('/:id', authMiddleware, updatePharmacy);

// @route   GET /api/pharmacies/nearby
// @desc    Find nearby pharmacies
// @access  Public
router.get('/nearby', findNearbyPharmacies);

module.exports = router;