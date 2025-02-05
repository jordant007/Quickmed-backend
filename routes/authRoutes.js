const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route: Register user
router.post('/signup', authController.signup);

// Route: Authenticate user & get token
router.post('/signin', authController.signin);

// Route: Get logged-in user
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;