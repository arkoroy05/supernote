import mongoose from "mongoose";

const stealthPitchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    default: "Untitled Stealth Pitch",
  },
  pitch: {
    type: String,
    required: true,
    default: "sample pitch data",
  },
  amount: {
    type: Number,
    required: false,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  approves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  rejects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }]
}, { timestamps: true });

const StealthPitch = mongoose.model("StealthPitch", stealthPitchSchema);
export default StealthPitch;