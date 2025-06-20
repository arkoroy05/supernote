import express from 'express';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();


router.post('/verify', verifyToken);

export default router;