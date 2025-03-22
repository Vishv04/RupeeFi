import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile,
  deleteProfile
} from '../controllers/userController.js';

router.use(protect); // Protect all routes

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteProfile);

export default router; 