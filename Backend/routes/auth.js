import express from 'express';
const router = express.Router();
import { googleLogin } from '../controllers/authController.js';

router.post('/google-login', googleLogin);

export default router; 