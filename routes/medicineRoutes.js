const express = require('express');
const router = express.Router();
const { 
  addMedicine, 
  updateMedicineStock, 
  searchMedicines 
} = require('../controllers/medicineController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/medicines
// @desc    Add a new medicine
// @access  Private
router.post('/', authMiddleware, addMedicine);

// @route   PATCH /api/medicines/:id/stock
// @desc    Update medicine stock
// @access  Private
router.patch('/:id/stock', authMiddleware, updateMedicineStock);

// @route   GET /api/medicines/search
// @desc    Search for medicines
// @access  Public
router.get('/search', searchMedicines);

module.exports = router;