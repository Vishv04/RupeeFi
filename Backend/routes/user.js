import express from 'express';
import protect from '../middleware/auth.js';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profile.js';

const router = express.Router();

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

export default router;