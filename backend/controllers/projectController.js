import Project from '../models/projectModel.js';
import { chatModel, embeddingModel } from '../services/aiService.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser, JsonOutputParser } from '@langchain/core/output_parsers';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { collection } from '../config/db.js';
import { z } from 'zod';


const buildFullGraphContext = (nodes, edges) => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const childrenMap = new Map();
    const roots = new Set(nodes.map(n => n.id));

    for (const edge of edges) {
        if (!childrenMap.has(edge.source)) {
            childrenMap.set(edge.source, []);
        }
        childrenMap.get(edge.source).push(edge.target);
        roots.delete(edge.target); // A node with an incoming edge is not a root
    }

    let fullContext = '';
    const traverse = (nodeId, depth) => {
        const node = nodeMap.get(nodeId);
        if (!node) return;

        fullContext += `${'  '.repeat(depth)}- ${node.data.label}\n`;
        if (childrenMap.has(nodeId)) {
            for (const childId of childrenMap.get(nodeId)) {
                traverse(childId, depth + 1);
            }
        }
    };

    roots.forEach(rootId => traverse(rootId, 0));
    return fullContext;
};

const buildHierarchicalContext = (nodes, edges, startNodeId) => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    const parentMap = new Map(edges.map(e => [e.target, e.source]));

    const path = [];
    let currentNodeId = startNodeId;


    while (currentNodeId) {
        const node = nodeMap.get(currentNodeId);
        if (node) {
            path.unshift(node);
        }
        currentNodeId = parentMap.get(currentNodeId);
    }


    return path.map((node, index) => `${'  '.repeat(index)}- ${node.data.label}`).join('\n');
};


export const createProject = async (req, res) => {
    const { name, nodes, edges } = req.body;
    if (!nodes || !edges || !name) {
        return res.status(400).json({ message: 'Project name, nodes, and edges are required.' });
    }

    try {
        const _user = await req.civicAuth.getUser();
        const userId = _user.id;

        const project = new Project({
            user: userId,
            name,
            nodes,
            edges
        });

        const initialContext = buildFullGraphContext(nodes, edges);


        const opportunityPrompt = PromptTemplate.fromTemplate(
            `Based on this initial startup idea, analyze the market and identify a key opportunity. Provide your response ONLY as a valid JSON object with keys: "id", "type", "market", "target", "main_competitors", "trendAnalysis".Please write max 2-3 words per key, 1 word per key is preferred .\n\nIdea:\n{context}`
        );
        const opportunityChain = opportunityPrompt.pipe(chatModel).pipe(new JsonOutputParser());
        const opportunityData = await opportunityChain.invoke({ context: initialContext });

        project.categorization = opportunityData;

        const createdProject = await project.save();
        res.status(201).json(createdProject);

    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error while creating project.' });
    }
};


export const converseWithNode = async (req, res) => {
    const { parentNodeId, prompt, position, useRAG } = req.body;
    const { projectId } = req.params;

    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
        return res.status(400).json({ message: 'A valid node position object {x, y} is required.' });
    }
    if (!prompt || !parentNodeId) {
        return res.status(400).json({ message: 'A parentNodeId and prompt are required.' });
    }

    try {
        const _user = await req.civicAuth.getUser();
        const userId = _user.id;
        const project = await Project.findOne({ _id: projectId, user: userId });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or you do not have permission.' });
        }

        const conversation_history = buildHierarchicalContext(project.nodes, project.edges, parentNodeId);

        // Define a Zod schema to enforce the AI's output structure.
        const titleAndContentSchema = z.object({
            title: z.string().describe("A concise, 5-10 word title for the generated content."),
            content: z.string().describe("The full, detailed response to the user's question."),
        });

        // The prompt no longer needs to mention JSON formatting.
        const llmPromptTemplate = PromptTemplate.fromTemplate(
            `You are an expert research assistant. Given the conversation history, intelligently answer the user's question and provide a suitable title for your response.

            Conversation History (for context):\n{conversation_history}\n\n
            User's Question:\n{question}\n\n`
        );

        // Bind the schema to the model to enforce structured output.
        // This is much more reliable than parsing raw text.
        const structuredOutputModel = chatModel.withStructuredOutput(titleAndContentSchema);

        const chain = RunnableSequence.from([
            {
                question: (input) => input.question,
                conversation_history: (input) => input.conversation_history,
                context: async (input) => {
                    if (!useRAG) return "No documents requested.";
                    const vectorStore = new MongoDBAtlasVectorSearch(embeddingModel, {
                        collection: collection('vectors'),
                        indexName: "default",
                    });
                    const retriever = vectorStore.asRetriever({ filter: { preFilter: { userId: input.userId } } });
                    const docs = await retriever.getRelevantDocuments(input.question);
                    return docs.map(doc => doc.pageContent).join('\n---\n');
                }
            },
            llmPromptTemplate,
            structuredOutputModel, // Use the new model with enforced structured output
        ]);

        // The result will be a clean, validated object: { title: string, content: string }
        const result = await chain.invoke({
            question: prompt,
            conversation_history: conversation_history,
            userId: userId
        });

        const newNode = {
            id: `node_${Date.now()}`,
            data: { label: result.content, prompt: prompt },
            position: position,
            title: result.title,
        };

        const newEdge = {
            id: `edge_${parentNodeId}-${newNode.id}`,
            source: parentNodeId,
            target: newNode.id,
        };

        project.nodes.push(newNode);
        project.edges.push(newEdge);
        await project.save();

        res.status(201).json({ newNode, newEdge });

    } catch (error) {
        console.error('Error during conversation:', error);
        res.status(500).json({ message: 'Server error during conversation.' });
    }
};

export const synthesizeDocument = async (req, res) => {
    const { projectId } = req.params;

    try {
        const _user = await req.civicAuth.getUser();
        const userId = _user.id;
        const project = await Project.findOne({ _id: projectId, user: userId });
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const synthesisContext = buildFullGraphContext(project.nodes, project.edges);

        if (!synthesisContext) {
            return res.status(400).json({ message: 'Cannot synthesize an empty project.' });
        }

        const synthesisPrompt = PromptTemplate.fromTemplate(
            `You are a professional technical writer and business analyst. Your task is to synthesize the following complete research graph, which is represented as a structured, indented text, into a single, comprehensive, and well-structured report in Markdown format.\n` +
            `You must identify the different branches of thought, compare and contrast them, and form a cohesive narrative. The final document should have a clear introduction, body, and conclusion.\n\n` +
            `Full Research Graph:\n---\n{notes}\n---\n\n` +
            `Generate the full Markdown report now:`
        );

        const synthesisChain = synthesisPrompt.pipe(chatModel).pipe(new StringOutputParser());
        const finalReport = await synthesisChain.invoke({ notes: synthesisContext });

        res.status(200).json({ document: finalReport });
        console.log('Document synthesized successfully:', finalReport);
    } catch (error) {
        console.error('Error synthesizing document:', error);
        res.status(500).json({ message: 'Error synthesizing document.' });
    }
};


export const getProjectById = async (req, res) => {
    try {
        const _user = await req.civicAuth.getUser();
        const userId = _user.id;

        const project = await Project.findOne({ _id: req.params.projectId, user: userId });
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const getUserProjects = async (req, res) => {
    try {
        const _user = await req.civicAuth.getUser();
        const userId = _user.id;
        const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};



export const updateProjectRating = async (req, res) => {
    const { projectId } = req.params;

    try {
        const _user = await req.civicAuth.getUser();
        const userId = _user.id;
        const project = await Project.findOne({ _id: projectId, user: userId });
        if (!project) return res.status(404).json({ message: 'Project not found.' });

        const researchContext = buildFullGraphContext(project.nodes, project.edges);

        const ratingPrompt = PromptTemplate.fromTemplate(
            `You are a seasoned venture capitalist. Critically assess the following research notes. Be brutally honest — do not inflate scores. We want to challenge the founder. Always assume this is a pitch from a first-time founder who needs real guidance.\n\nBased on the research below, evaluate the startup across four axes: \n\n1. 'opportunity' (0-10): Evaluate the market size, urgency, and long-term potential.\n2. 'problem' (0-10): Is the problem clearly defined and significant for a real audience?\n3. 'feasibility' (0-10): Can this be realistically executed?\n4. 'why_now' (0-10): Is there a strong, time-sensitive reason this should exist now?\n\nYou must return your evaluation as a valid JSON object with the following keys:\n\n- "opportunity": number (0–10)\n- "problem": number (0–10)\n- "feasibility": number (0–10)\n- "why_now": number (0–10)\n- "feedback": string\n\nYour 'feedback' must include exactly 3 pros and 3 cons, separated by newlines. The tone should be firm but constructive. Do not hold back if the idea is weak. Example for feedback: "Pro: Large addressable market.\\nPro: Clear value proposition.\\nPro: Strong team-market fit.\\nCon: High customer acquisition cost.\\nCon: Potential regulatory hurdles.\\nCon: Unclear defensibility."\n\nHere are the research notes:\n{notes}`
        );

        const ratingChain = ratingPrompt.pipe(chatModel).pipe(new JsonOutputParser());
        const ratingData = await ratingChain.invoke({ notes: researchContext });

        project.projectRating = ratingData;
        const updatedProject = await project.save();

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project rating:', error);
        res.status(500).json({ message: 'Error updating rating.' });
    }
};

export const generateValidationPitch = async (req, res) => {
    const { projectId } = req.params;
    const { validationMetric } = req.body;

    try {
        const _user = await req.civicAuth.getUser();
        const userId = _user.id;
        const project = await Project.findOne({ _id: projectId, user: userId });
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const ideaSummary = buildFullGraphContext(project.nodes, project.edges);

        if (!ideaSummary) {
            return res.status(400).json({ message: 'Cannot summarize an empty project.' });
        }

        const pitchPrompt = PromptTemplate.fromTemplate(
            `You are a stealth marketing expert. Your goal is to validate a startup idea without revealing that you are building it. You will write a short post or message designed to be shared on a platform like Reddit, LinkedIn, or a specific forum to gauge real-world user reaction.\n\n` +
            `Startup Idea Summary (based on research notes):\n{ideaSummary}\n\n` +
            `The primary goal is to validate the following metric: **{validationMetric}**\n\n` +
            `Instructions:\n` +
            `1.  Do NOT sound like an advertisement.\n` +
            `2.  Frame the post as a question, a personal story, or a search for a solution.\n` +
            `3.  The post should be written to provoke comments and discussions that directly help validate the chosen metric.\n` +
            `4.  Suggest the best online community or platform (e.g., 'a subreddit like r/Entrepreneur', 'a LinkedIn post targeting marketing managers') where this pitch should be posted.\n\n` +
            `Write the stealth pitch now.`
        );

        const pitchChain = pitchPrompt.pipe(chatModel).pipe(new StringOutputParser());
        const pitch = await pitchChain.invoke({
            ideaSummary,
            validationMetric
        });

        res.status(200).json({ pitch });
    } catch (error) {
        console.error('Error generating validation pitch:', error);
        res.status(500).json({ message: 'Error generating pitch.' });
    }
};

export const regenerateNode = async (req, res) => {
    const { projectId, nodeId } = req.params;
    const { newPrompt } = req.body;

    try {
        const _user = await req.civicAuth.getUser();
        const userId = _user.id;
        const project = await Project.findOne({ _id: projectId, user: userId });
        if (!project) return res.status(404).json({ message: 'Project not found.' });

        const nodeToUpdate = project.nodes.find(n => n.id === nodeId);
        if (!nodeToUpdate) return res.status(404).json({ message: 'Node not found.' });


        const edge = project.edges.find(e => e.target === nodeId);
        if (!edge) return res.status(400).json({ message: 'Cannot regenerate a root node this way.' });

        const parentNodeId = edge.source;
        const conversation_history = buildHierarchicalContext(project.nodes, project.edges, parentNodeId);

        const regenPrompt = PromptTemplate.fromTemplate(
            `History: {conversation_history}\n\nQuestion: {question}\n\nAnswer:`
        );
        const chain = regenPrompt.pipe(chatModel).pipe(new StringOutputParser());

        const newContent = await chain.invoke({
            question: newPrompt,
            conversation_history: conversation_history,
        });

        nodeToUpdate.data.label = newContent;
        nodeToUpdate.data.prompt = newPrompt;

        await project.save();

        res.status(200).json(nodeToUpdate);

        res.status(200).json({ message: 'Node regenerated successfully.' });

    } catch (error) {
        console.error('Error regenerating node:', error);
        res.status(500).json({ message: 'Error regenerating node.' });
    }
};

export const deleteNode = async (req, res) => {
    const { projectId, nodeId } = req.params;
    try {
        const project = await Project.findOne({ _id: projectId, user: req.user.id });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const initialNodeCount = project.nodes.length;


        project.nodes = project.nodes.filter(node => node.id !== nodeId);


        project.edges = project.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);

        if (project.nodes.length === initialNodeCount) {
            return res.status(404).json({ message: 'Node ID not found in project' });
        }

        const updatedProject = await project.save();
        res.status(200).json(updatedProject);

    } catch (error) {
        console.error('Error deleting node:', error);
        res.status(500).json({ message: 'Server error while deleting node.' });
    }
};

export const updateNodePositions = async (req, res) => {
    const { projectId } = req.params;

    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({ message: 'Request body must include an array of updates.' });
    }

    try {
        const _user = await req.civicAuth.getUser();
        const userId = _user.id;
        const project = await Project.findOne({ _id: projectId, user: userId });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or you do not have permission.' });
        }

        const nodeMap = new Map(project.nodes.map(node => [node.id, node]));


        for (const update of updates) {
            if (nodeMap.has(update.id)) {
                const nodeToUpdate = nodeMap.get(update.id);

                nodeToUpdate.position.x = update.position.x;
                nodeToUpdate.position.y = update.position.y;
            }
        }

        const updatedProject = await project.save();
        res.status(200).json(updatedProject);

    } catch (error) {
        console.error('Error updating node positions:', error);
        res.status(500).json({ message: 'Server error while updating positions.' });
    }
};