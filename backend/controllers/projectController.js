import Project from '../models/projectModel.js';
import { chatModel, embeddingModel } from '../services/aiService.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { collection } from '../config/db.js';

/**

 * @param {Array} nodes - All nodes in the project.
 * @param {Array} edges - All edges in the project.
 * @param {String} startNodeId - The ID of the node to trace back from.
 * @returns {String} - An indented string representing the conversational context.
 */
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

/**
 * @desc    Create a new project with an initial graph structure.
 * @route   POST /api/project
 * @access  Protected
 */
export const createProject = async (req, res) => {

    const { name, nodes, edges } = req.body;

    if (!nodes || !edges || !name) {
        return res.status(400).json({ message: 'Project name, nodes, and edges are required.' });
    }

    try {
        const project = new Project({
            user: req.user.id,
            name,
            nodes,
            edges
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error while creating project.' });
    }
};

/**
 * @desc    The core research loop: takes a prompt on a node and generates a new node.
 * @route   POST /api/project/:projectId/converse
 * @access  Protected
 */
export const converseWithNode = async (req, res) => {
    const { parentNodeId, prompt, useRAG } = req.body;
    const { projectId } = req.params;

    try {
        const project = await Project.findOne({ _id: projectId, user: req.user.id });
        if (!project) return res.status(404).json({ message: 'Project not found.' });


        const conversation_history = buildHierarchicalContext(project.nodes, project.edges, parentNodeId);

        const llmPromptTemplate = PromptTemplate.fromTemplate(
            `You are an expert research assistant. Given the conversation history and potentially some retrieved documents, answer the user's question intelligently.\n\n` +
            `Conversation History (for context):\n{conversation_history}\n\n` +
            `Retrieved Documents (if any):\n{context}\n\n` +
            `User's Question:\n{question}\n\n` +
            `Your Answer:`
        );

        const chain = RunnableSequence.from([
            {
                question: (input) => input.question,
                conversation_history: (input) => input.conversation_history,
                context: async (input) => {
                    if (!useRAG) return "No documents requested.";
                    
                    const vectorStore = new MongoDBAtlasVectorSearch(embeddingModel, {
                        collection: collection('DB1'), 
                        indexName: "default",
                    });
                    
                    const retriever = vectorStore.asRetriever({
                        filter: { preFilter: { userId: input.userId } }
                    });
                    
                    const docs = await retriever.getRelevantDocuments(input.question);
                    return docs.map(doc => doc.pageContent).join('\n---\n');
                }
            },
            llmPromptTemplate,
            chatModel,
            new StringOutputParser(),
        ]);

        const result = await chain.invoke({
            question: prompt,
            conversation_history: conversation_history, 
            userId: req.user.id
        });
        

        const parentNode = project.nodes.find(n => n.id === parentNodeId);
        if (!parentNode) {
            return res.status(404).json({ message: "Parent node not found in project." });
        }

        const newNode = {
            id: `node_${Date.now()}`,
            data: { label: result, prompt: prompt },
           
            position: { x: parentNode.position.x, y: parentNode.position.y + 120 },
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
        res.status(500).json({ message: 'Conversation error.' });
    }
};

/**
 * @desc    Generates a final, structured Markdown document from selected nodes.
 * @route   POST /api/project/:projectId/synthesize
 * @access  Protected
 */
export const synthesizeDocument = async (req, res) => {
    const { selectedNodeIds } = req.body;
    const { projectId } = req.params;

    try {
        const project = await Project.findOne({ _id: projectId, user: req.user.id });
        if (!project) return res.status(404).json({ message: 'Project not found.' });

        const synthesisContext = selectedNodeIds
            .map(id => buildHierarchicalContext(project.nodes, project.edges, id))
            .join('\n\n---\n\n');

        const synthesisPrompt = PromptTemplate.fromTemplate(
            `You are a professional technical writer and business analyst. Your task is to synthesize the following research notes into a single, comprehensive, and well-structured report in Markdown format.\n` +
            `The notes are structured hierarchically. Where different branches exist, you must compare and contrast them.\n\n` +
            `Research Notes:\n---\n{notes}\n---\n\n` +
            `Generate the full Markdown report now:`
        );

        const synthesisChain = synthesisPrompt.pipe(chatModel).pipe(new StringOutputParser());
        const finalReport = await synthesisChain.invoke({ notes: synthesisContext });

        res.status(200).json({ document: finalReport });
    } catch (error) {
        console.error('Error synthesizing document:', error);
        res.status(500).json({ message: 'Synthesis error.' });
    }
};

/**
 * @desc    Get a single project by its ID.
 * @route   GET /api/project/:projectId
 * @access  Protected
 */
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId, user: req.user.id });
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get all projects for the logged-in user.
 * @route   GET /api/project
 * @access  Protected
 */
export const getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};