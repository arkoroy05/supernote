import express from 'express';
import {
    createProject,
    getUserProjects,
    getProjectById,
    converseWithNode,
    synthesizeDocument,
    rateIdeaState,
    regenerateNode,
    generateValidationPitch
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

// Route for AI to rate the current state of the idea
router.route('/:projectId/rate')
    .post(protect, rateIdeaState);

// Route to regenerate a single node's content
router.route('/:projectId/node/:nodeId/regenerate')
    .put(protect, regenerateNode);

// Route to generate a validation stealth pitch
router.route('/:projectId/generate-pitch')
    .post(protect, generateValidationPitch);

router.route('/working').get((req, res) => {
    res.status(200).json({ message: 'Project routes are working!' });
});

export default router;