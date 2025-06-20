"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, BackgroundVariant, useNodesState, useEdgesState, addEdge, Connection, Edge, Node, NodeProps, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, X, Sparkles, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Types for node data
interface NodeData {
    title: string;
    description: string;
    fullContent?: string;
}

// Custom Node Component
const IdeaNode: React.FC<NodeProps<NodeData> & { onCreateNode: (nodeId: string) => void; onNodeClick: (nodeId: string) => void }> = ({ data, id, onCreateNode, onNodeClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 min-w-[280px] max-w-[350px] hover:shadow-xl transition-shadow duration-200">
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
        
        <div className="space-y-3">
            {/* Title */}
            <h3 
            className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => onNodeClick(id)}
            >
            {data.title}
            </h3>
            
            {/* Description */}
            <p 
            className="text-sm text-gray-600 line-clamp-3 cursor-pointer hover:text-gray-800 transition-colors"
            onClick={() => onNodeClick(id)}
            >
            {data.description}
            </p>
            
            {/* Create Node Button */}
            <button
            onClick={() => onCreateNode(id)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 flex items-center justify-center space-x-2 transition-all duration-200"
            >
            <Plus className="w-4 h-4" />
            <span>Create Node From Here</span>
            </button>
        </div>
        
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-500" />
        </div>
    );
};

// Modal Component for Creating New Nodes
const CreateNodeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onCreateManual: (title: string, description: string) => void;
    onCreateFromPrompt: (prompt: string) => void;
    parentTitle: string;
}> = ({ isOpen, onClose, onCreateManual, onCreateFromPrompt, parentTitle }) => {
    const [mode, setMode] = useState<'select' | 'manual' | 'prompt'>('select');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const resetModal = () => {
        setMode('select');
        setTitle('');
        setDescription('');
        setPrompt('');
        setIsGenerating(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleManualCreate = () => {
        if (title.trim() && description.trim()) {
        onCreateManual(title, description);
        handleClose();
        }
    };

    const handlePromptCreate = () => {
        if (prompt.trim()) {
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            onCreateFromPrompt(prompt);
            setIsGenerating(false);
            handleClose();
        }, 1500);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
                Create Node from "{parentTitle}"
            </h2>
            <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
            >
                <X className="w-5 h-5" />
            </button>
            </div>

            {mode === 'select' && (
            <div className="space-y-4">
                <button
                onClick={() => setMode('manual')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
                >
                <div className="flex items-center space-x-3">
                    <Edit className="w-5 h-5 text-blue-500" />
                    <div>
                    <h3 className="font-medium text-gray-900">Create Manually</h3>
                    <p className="text-sm text-gray-600">Define your own title and description</p>
                    </div>
                </div>
                </button>

                <button
                onClick={() => setMode('prompt')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left"
                >
                <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <div>
                    <h3 className="font-medium text-gray-900">Generate via Prompt</h3>
                    <p className="text-sm text-gray-600">Let AI create the node based on your prompt</p>
                    </div>
                </div>
                </button>
            </div>
            )}

            {mode === 'manual' && (
            <div className="space-y-4">
                <button
                onClick={() => setMode('select')}
                className="text-sm text-blue-600 hover:text-blue-800"
                >
                ← Back to options
                </button>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter node title..."
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter node description..."
                />
                </div>
                <button
                onClick={handleManualCreate}
                disabled={!title.trim() || !description.trim()}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Create Node
                </button>
            </div>
            )}

            {mode === 'prompt' && (
            <div className="space-y-4">
                <button
                onClick={() => setMode('select')}
                className="text-sm text-blue-600 hover:text-blue-800"
                >
                ← Back to options
                </button>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe what you want the new node to be about..."
                />
                </div>
                <button
                onClick={handlePromptCreate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                {isGenerating ? (
                    <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                    </>
                ) : (
                    <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Node</span>
                    </>
                )}
                </button>
            </div>
            )}
        </div>
        </div>
    );
};

// Node types
const nodeTypes = {
    ideaNode: (props: NodeProps<NodeData>) => (
        <IdeaNode 
        {...props} 
        onCreateNode={(nodeId: string) => {
            // This will be set by the parent component
            (window as any).__handleCreateNode?.(nodeId);
        }}
        onNodeClick={(nodeId: string) => {
            // This will be set by the parent component
            (window as any).__handleNodeClick?.(nodeId);
        }}
        />
    ),
};

export default function GraphPage() {
    const router = useRouter();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState<string>('');
    const [selectedParentTitle, setSelectedParentTitle] = useState<string>('');

    // Handle creating new nodes
    const handleCreateNode = useCallback((parentId: string) => {
        console.log('Creating node from parent:', parentId);
        const parentNode = nodes.find(node => node.id === parentId);
        if (parentNode) {
        setSelectedParentId(parentId);
        setSelectedParentTitle(parentNode.data.title);
        setModalOpen(true);
        }
    }, [nodes]);

    // Handle node click to navigate to /idea
    const handleNodeClick = useCallback((nodeId: string) => {
        console.log('Node clicked:', nodeId);
        router.push('/idea');
    }, [router]);

    // Set global handlers for the node component
    useEffect(() => {
        (window as any).__handleCreateNode = handleCreateNode;
        (window as any).__handleNodeClick = handleNodeClick;
        
        return () => {
        delete (window as any).__handleCreateNode;
        delete (window as any).__handleNodeClick;
        };
    }, [handleCreateNode, handleNodeClick]);

    // Simulate fetching initial node from API
    const fetchInitialNode = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const initialNode: Node<NodeData> = {
        id: 'initial-node',
        type: 'ideaNode',
        position: { x: 400, y: 200 },
        data: {
            title: 'Building CreatorShield',
            description: 'A decentralized platform for creators to protect, enforce, and monetize brand deals using smart contracts and automation — no lawyers or middlemen.',
            fullContent: 'This is the main strategic node that was created from the previous page. It contains all the initial planning data and serves as the starting point for our mindmapping exercise.',
        },
        };

        setNodes([initialNode]);
        setIsLoading(false);
    }, [setNodes]);

    // Create node manually
    const createManualNode = useCallback((title: string, description: string) => {
        const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const parentNode = nodes.find(node => node.id === selectedParentId);
        
        if (!parentNode) return;

        const newNode: Node<NodeData> = {
        id: newNodeId,
        type: 'ideaNode',
        position: {
            x: parentNode.position.x + 400,
            y: parentNode.position.y + Math.random() * 200 - 100,
        },
        data: {
            title,
            description,
            fullContent: `This node was created manually from "${parentNode.data.title}". Additional details and content would be stored here in a real application.`,
        },
        };

        setNodes(nds => [...nds, newNode]);
        
        const newEdge: Edge = {
        id: `edge-${selectedParentId}-${newNodeId}`,
        source: selectedParentId,
        target: newNodeId,
        type: 'bezier',
        animated: false,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        };
        
        setEdges(eds => [...eds, newEdge]);
    }, [selectedParentId, nodes, setNodes, setEdges]);

    // Create node from prompt
    const createNodeFromPrompt = useCallback((prompt: string) => {
        const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const parentNode = nodes.find(node => node.id === selectedParentId);
        
        if (!parentNode) return;

        // Simulate AI generation
        const generatedTitle = `AI Generated: ${prompt.substring(0, 30)}...`;
        const generatedDescription = `This node was generated based on the prompt: "${prompt}". In a real implementation, this would contain AI-generated content relevant to your request.`;

        const newNode: Node<NodeData> = {
        id: newNodeId,
        type: 'ideaNode',
        position: {
            x: parentNode.position.x + 400,
            y: parentNode.position.y + Math.random() * 200 - 100,
        },
        data: {
            title: generatedTitle,
            description: generatedDescription,
            fullContent: `Generated from prompt: "${prompt}"\n\nThis content was created by AI based on your request. It would contain detailed analysis, suggestions, and relevant information based on the context of the parent node and your specific prompt.`,
        },
        };

        setNodes(nds => [...nds, newNode]);
        
        const newEdge: Edge = {
        id: `edge-${selectedParentId}-${newNodeId}`,
        source: selectedParentId,
        target: newNodeId,
        type: 'bezier',
        animated: false,
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        };
        
        setEdges(eds => [...eds, newEdge]);
    }, [selectedParentId, nodes, setNodes, setEdges]);

    // Handle edge connections
    const onConnect = useCallback(
        (params: Edge | Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
        [setEdges]
    );

    // Fetch initial node on mount
    useEffect(() => {
        fetchInitialNode();
    }, [fetchInitialNode]);

    return (
        <div className="w-full h-screen bg-gray-50">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm border-b p-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Idea Mindmap</h1>
                <p className="text-sm text-gray-600">
                {isLoading ? 'Loading initial node...' : 'Click on nodes to view details, use "Create Node From Here" to expand'}
                </p>
            </div>
            </div>
        </div>

        {/* Loading Screen */}
        {isLoading ? (
            <div className="pt-20 h-full flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Fetching your initial idea...</p>
            </div>
            </div>
        ) : (
            <>
            {/* React Flow */}
            <div className="pt-20 h-full">
                <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                className="bg-gray-50"
                defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
                minZoom={0.3}
                maxZoom={2}
                >
                <Controls className="bg-white shadow-lg rounded-lg" />
                <MiniMap
                    className="bg-white rounded-lg shadow-lg"
                    nodeColor="#3b82f6"
                    maskColor="rgba(0, 0, 0, 0.1)"
                />
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
                </ReactFlow>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
                <h3 className="font-semibold text-gray-900 mb-2">How to use:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click any node to view full details</li>
                <li>• Use "Create Node From Here" to expand ideas</li>
                <li>• Choose manual creation or AI generation</li>
                <li>• Drag nodes to reorganize the mindmap</li>
                <li>• Use controls to zoom and navigate</li>
                </ul>
            </div>

            {/* Create Node Modal */}
            <CreateNodeModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreateManual={createManualNode}
                onCreateFromPrompt={createNodeFromPrompt}
                parentTitle={selectedParentTitle}
            />
            </>
        )}
        </div>
    );
}