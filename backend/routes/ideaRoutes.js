import express from 'express';
import { analyzeIdea } from '../controllers/ideaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/analyze', protect, analyzeIdea);

export default router;