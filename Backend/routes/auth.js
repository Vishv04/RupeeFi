const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, googleLogin } = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/google-login', googleLogin);

module.exports = router; 