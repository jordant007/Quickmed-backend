const express = require('express');
const router = express.Router();
const { signup, signin, getCurrentUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route: Register user
router.post('/signup', signup);

// Route: Authenticate user & get token
router.post('/signin', signin);

// Route: Get logged-in user
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;