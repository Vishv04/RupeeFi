import express from 'express';
import { protect } from '../middleware/auth.js';
import { getStreakInfo } from '../controllers/streakRewards.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get streak information
router.get('/info', getStreakInfo);

export default router;
