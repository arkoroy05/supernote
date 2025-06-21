import express from 'express';
import {
    postStealthPitch,
    getAllStealthPitches,
    likePitch,
    dislikePitch,
    approvePitch,
    rejectPitch,
    addComment,
    deleteComment,
    editPitch,
    deleteStealthPitch,
} from '../controllers/stealthController.js';
import { protect } from '../middleware/authMiddleware.js';

// // You would import your authentication middleware here
// // For example: import { protect } from '../middleware/authMiddleware.js';
// // This is a placeholder for the auth middleware
// const protect = (req, res, next) => {
//     // In a real app, you'd verify a JWT token and attach the user to the request.
//     // For demonstration, we'll mock a user object.
//     req.user = { _id: '60d0fe4f5311236168a109ca' }; // Example user ID
//     next();
// };


const router = express.Router();

// -- Pitch Creation & Retrieval --
// POST a new stealth pitch
router.route('/').post(protect, postStealthPitch);
// GET all stealth pitches
router.route('/').get(getAllStealthPitches);

// -- Pitch Actions (Likes, Dislikes, etc.) --
// PATCH to like a pitch
router.route('/:id/like').patch(protect, likePitch);
// PATCH to dislike a pitch
router.route('/:id/dislike').patch(protect, dislikePitch);
// PATCH to approve a pitch
router.route('/:id/approve').patch(protect, approvePitch);
// PATCH to reject a pitch
router.route('/:id/reject').patch(protect, rejectPitch);

// -- Comments --
// POST to add a comment
router.route('/:id/comment').post(protect, addComment);
// DELETE a specific comment from a pitch
router.route('/:pitchId/comment/:commentId').delete(protect, deleteComment);

// -- Pitch Management --
// PATCH to edit a pitch (title, content)
router.route('/:id').patch(protect, editPitch);
// DELETE a pitch
router.route('/:id').delete(protect, deleteStealthPitch);


export default router;
