import express from 'express';
import multer from 'multer';
import { uploadDocument } from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', protect, upload.single('file'), uploadDocument);

export default router;