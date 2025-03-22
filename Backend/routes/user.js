const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  deleteProfile
} = require('../controllers/userController');

router.use(protect); // Protect all routes

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteProfile);

module.exports = router; 