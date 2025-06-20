import express from 'express';
import {
    createProject,
    getUserProjects,
    getProjectById,
    converseWithNode,
    synthesizeDocument
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for getting all projects and creating a new one
router.route('/')
    .get(protect, getUserProjects)
    .post(protect, createProject);

// Route for getting a single project by its ID
router.route('/:projectId')
    .get(protect, getProjectById);

// Route for the core conversational research loop
router.route('/:projectId/converse')
    .post(protect, converseWithNode);

// Route for generating the final synthesized document
router.route('/:projectId/synthesize')
    .post(protect, synthesizeDocument);

export default router;