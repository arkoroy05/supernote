import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    data: {
        label: { type: String, required: true },
        prompt: String,
    },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    title: { type: String, required: false },
});

const edgeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
});


const categorizationSchema = new mongoose.Schema({
    type: { type: String, required: true },
    market: { type: String, required: true },
    target: { type: String, required: true },
    main_competitors: { type: String, required: true },
    trendAnalysis: { type: String, required: true },
});

const projectRatingSchema = new mongoose.Schema({
    opportunity: { type: Number, required: true },
    problem: { type: Number, required: true },
    feasibility: { type: Number, required: true },
    why_now: { type: Number, required: true },
    feedback: { type: String, required: false },
});

const projectSchema = new mongoose.Schema({
    user: {
        type: String,
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

    categorization: { type: categorizationSchema, required: false },
    projectRating: {
        type: projectRatingSchema,
        required: false,
    },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;