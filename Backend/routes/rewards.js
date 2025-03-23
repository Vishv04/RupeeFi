import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getSpinsAvailable,
  spinWheel,
  getRewardHistory,
  claimDailySpin,
  getScratchCards,
  scratchCard
} from '../controllers/rewardsController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/spins-available', getSpinsAvailable);
router.post('/spin', spinWheel);
router.get('/history', getRewardHistory);
router.post('/claim-daily', claimDailySpin);
router.get('/scratch-cards', getScratchCards);
router.post('/scratch', scratchCard);

export default router; 