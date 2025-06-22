import StealthPitch from '../models/stealthPitchModel.js';
import mongoose from 'mongoose';

// @desc    Create a new stealth pitch
// @route   POST /api/stealth
// @access  Private
const postStealthPitch = async (req, res) => {
    try {
        const { title, pitch, amount } = req.body;

        
        // Assuming user ID is available in req.user from an auth middleware
        const _user = await req.civicAuth.getUser();
        const userId = _user.id;

        if (!pitch) {
            return res.status(400).json({ message: 'Pitch content is required.' });
        }

        const newPitch = new StealthPitch({
            user: userId,
            title,
            pitch,
            amount,
        });

        const createdPitch = await newPitch.save();
        res.status(201).json(createdPitch);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get all stealth pitches
// @route   GET /api/stealth
// @access  Public
const getAllStealthPitches = async (req, res) => {
    try {
        // Populate user details to show who created the pitch
        const pitches = await StealthPitch.find({}).populate('user', 'name email');
        res.status(200).json(pitches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


// @desc    Like a pitch
// @route   PATCH /api/stealth/:id/like
// @access  Private
const likePitch = async (req, res) => {
    try {
        const pitch = await StealthPitch.findById(req.params.id);

        if (!pitch) {
            return res.status(404).json({ message: 'Pitch not found.' });
        }

        // Assuming user ID is available from auth middleware
        const userId = req.user.id;
        // const user = await req.civicAuth.getUser()?.id;


        // Remove from dislikes if it exists there
        pitch.dislikes.pull(userId);

        // Add to likes using $addToSet to prevent duplicates
        await StealthPitch.findByIdAndUpdate(req.params.id, {
            $addToSet: { likes: userId },
            $pull: { dislikes: userId }
        }, { new: true });


        res.status(200).json({ message: 'Pitch liked successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Dislike a pitch
// @route   PATCH /api/stealth/:id/dislike
// @access  Private
const dislikePitch = async (req, res) => {
    try {
        const pitch = await StealthPitch.findById(req.params.id);

        if (!pitch) {
            return res.status(404).json({ message: 'Pitch not found.' });
        }

        const userId = req.user.id;
        // const userId = await req.civicAuth.getUser()?.id;


        // Remove from likes if it exists there
        pitch.likes.pull(userId);

        // Add to dislikes using $addToSet to prevent duplicates
        await StealthPitch.findByIdAndUpdate(req.params.id, {
            $addToSet: { dislikes: userId },
            $pull: { likes: userId }
        }, { new: true });

        res.status(200).json({ message: 'Pitch disliked successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Approve a pitch
// @route   PATCH /api/stealth/:id/approve
// @access  Private (e.g., for investors or admins)
const approvePitch = async (req, res) => {
    try {
        const pitch = await StealthPitch.findById(req.params.id);
        if (!pitch) {
            return res.status(404).json({ message: 'Pitch not found' });
        }

        const userId = req.user.id;
        // const userId = await req.civicAuth.getUser()?.id;


        await StealthPitch.findByIdAndUpdate(req.params.id, {
            $addToSet: { approves: userId },
            $pull: { rejects: userId } // A user cannot both approve and reject
        }, { new: true });

        res.status(200).json({ message: 'Pitch approved.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Reject a pitch
// @route   PATCH /api/stealth/:id/reject
// @access  Private (e.g., for investors or admins)
const rejectPitch = async (req, res) => {
    try {
        const pitch = await StealthPitch.findById(req.params.id);
        if (!pitch) {
            return res.status(404).json({ message: 'Pitch not found' });
        }

        const userId = req.user.id;
        // const userId = await req.civicAuth.getUser()?.id;


        await StealthPitch.findByIdAndUpdate(req.params.id, {
            $addToSet: { rejects: userId },
            $pull: { approves: userId } // A user cannot both reject and approve
        }, { new: true });

        res.status(200).json({ message: 'Pitch rejected.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


// @desc    Add a comment to a pitch
// @route   POST /api/stealth/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Comment text is required.' });
        }

        const pitch = await StealthPitch.findById(req.params.id);

        if (!pitch) {
            return res.status(404).json({ message: 'Pitch not found.' });
        }

        const user = req.user.id;
        // const user = await req.civicAuth.getUser()?.id;


        const comment = {
            user,
            text: text,
        };

        pitch.comments.push(comment);
        await pitch.save();

        res.status(201).json(pitch.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Delete a comment from a pitch
// @route   DELETE /api/stealth/:pitchId/comment/:commentId
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const { pitchId, commentId } = req.params;
        const pitch = await StealthPitch.findById(pitchId);

        if (!pitch) {
            return res.status(404).json({ message: 'Pitch not found.' });
        }

        // Find the comment to be deleted
        const comment = pitch.comments.id(commentId);
        console.log(comment);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // Check if the user trying to delete is the one who created the comment
        if (comment.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this comment.' });
        }

        // Remove the comment
        // comment.remove();

        // Remove the comment from the comments array
        pitch.comments = pitch.comments.filter(c => c.id.toString() !== commentId);

        await pitch.save();

        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Edit the title and pitch content
// @route   PATCH /api/stealth/:id
// @access  Private
const editPitch = async (req, res) => {
    try {
        const { title, pitch: pitchContent } = req.body;
        const pitch = await StealthPitch.findById(req.params.id);

        if (!pitch) {
            return res.status(404).json({ message: 'Pitch not found.' });
        }

        // Check ownership
        if (pitch.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized to edit this pitch.' });
        }

        pitch.title = title || pitch.title;
        pitch.pitch = pitchContent || pitch.pitch;

        const updatedPitch = await pitch.save();
        res.status(200).json(updatedPitch);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Delete a stealth pitch
// @route   DELETE /api/stealth/:id
// @access  Private
const deleteStealthPitch = async (req, res) => {
    try {
        const pitch = await StealthPitch.findById(req.params.id);

        if (!pitch) {
            return res.status(404).json({ message: 'Pitch not found.' });
        }

        // Check if the request is from the owner of the pitch
        if (pitch.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this pitch.' });
        }

        // await pitch.remove();
        await StealthPitch.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Stealth pitch removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

export {
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
};
