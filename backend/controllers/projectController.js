import Project from '../models/projectModel.js';
import { chatModel, embeddingModel } from '../services/aiService.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { collection } from '../config/db.js';


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


export const getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const rateIdeaState = async (req, res) => {
    const { projectId } = req.params;
    const { nodeIds } = req.body; 

    try {
        const project = await Project.findOne({ _id: projectId, user: req.user.id });
        if (!project) return res.status(404).json({ message: 'Project not found.' });

        const researchContext = nodeIds
            .map(id => buildHierarchicalContext(project.nodes, project.edges, id))
            .join('\n\n---\n\n');

        const ratingPrompt = PromptTemplate.fromTemplate(
            `You are a venture capitalist and startup incubator mentor. Based on the following research notes, critically assess the current state of the project idea.\n` +
            `Provide a rating from 1-10 and a brief justification for each of the following metrics:\n` +
            `1.  **Problem Severity:** How significant is the problem being solved?\n` +
            `2.  **Solution Feasibility:** How feasible is the proposed solution technically and financially?\n` +
            `3.  **Market Opportunity:** How large and accessible is the target market?\n` +
            `4.  **Urgency (Why Now?):** Is there a compelling reason this idea needs to exist right now?\n\n` +
            `Research Notes:\n---\n{notes}\n---\n\n` +
            `Your Assessment:`
        );

        const ratingChain = ratingPrompt.pipe(chatModel).pipe(new StringOutputParser());
        const rating = await ratingChain.invoke({ notes: researchContext });

        res.status(200).json({ rating });
    } catch (error) {
        console.error('Error rating idea state:', error);
        res.status(500).json({ message: 'Error rating idea.' });
    }
};

export const generateValidationPitch = async (req, res) => {
    const { projectId } = req.params;
   
    const { nodeIds, validationMetric } = req.body; 

    if (!nodeIds || !validationMetric || nodeIds.length === 0) {
        return res.status(400).json({ message: 'Node IDs and a validation metric are required.' });
    }

    try {
      
        const project = await Project.findOne({ _id: projectId, user: req.user.id });
        if (!project) return res.status(404).json({ message: 'Project not found.' });

      
        const ideaSummary = nodeIds
            .map(id => buildHierarchicalContext(project.nodes, project.edges, id))
            .join('\n\n---\n\n');


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
        const project = await Project.findOne({ _id: projectId, user: req.user.id });
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