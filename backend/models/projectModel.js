import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true }, // React Flow node ID
  data: {
    label: { type: String, required: true }, // The main content/text of the node
    prompt: String, // The user prompt that generated this node
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
});

const edgeSchema = new mongoose.Schema({
  id: { type: String, required: true }, // React Flow edge ID
  source: { type: String, required: true }, // Source node ID
  target: { type: String, required: true }, // Target node ID
});

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    default: 'Untitled Research',
  },
  nodes: [nodeSchema],
  edges: [edgeSchema],
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;