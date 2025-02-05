const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post('/signin', signin);

// @route   GET /api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;