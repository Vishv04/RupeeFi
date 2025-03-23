import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get employee profile
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'Employee profile route' });
});

// Get all employees (placeholder)
router.get('/', protect, (req, res) => {
  res.json({ message: 'Get all employees route' });
});

export default router; 