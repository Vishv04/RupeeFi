const express = require('express');
const walletController = require('../controllers/walletController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/initialize', auth, walletController.initializeWalletsForUser);

module.exports = router; 