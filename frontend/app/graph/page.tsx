"use client"

import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sparkles, Plus } from 'lucide-react';

// Custom Node Component
const IdeaNode: React.FC<NodeProps> = ({ data, id }) => {
  const [title, setTitle] = useState(data.title || 'New Idea');
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      data.onGenerate(id, title, prompt);
      setIsGenerating(false);
    }, 1000);
  }, [id, title, prompt, data]);

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 min-w-[300px] max-w-[400px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      
      <div className="space-y-3">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-lg font-semibold bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1"
          placeholder="Idea title..."
        />
        
        {/* Prompt Textarea */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your idea or ask a question..."
          className="w-full h-24 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate</span>
            </>
          )}
        </button>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500" />
    </div>
  );
};

// Node types
const nodeTypes = {
  ideaNode: IdeaNode,
};

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'ideaNode',
    position: { x: 400, y: 100 },
    data: {
      title: 'Main Idea',
      prompt: 'What problem are we solving?',
      onGenerate: () => {}, // Will be replaced in useEffect
    },
  },
];

const initialEdges: Edge[] = [];

export default function GraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(2);

  // Generate new node function
  const generateNewNode = useCallback((parentId: string, parentTitle: string, parentPrompt: string) => {
    // Generate unique ID using timestamp + random number to avoid collisions
    const newNodeId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setNodes((nds: Node[]) => {
      const parentNode = nds.find(node => node.id === parentId);
      if (!parentNode) return nds;

      const newNode: Node = {
        id: newNodeId,
        type: 'ideaNode',
        position: {
          x: parentNode.position.x + (Math.random() - 0.5) * 200,
          y: parentNode.position.y + 200,
        },
        data: {
          title: `Generated from: ${parentTitle}`,
          prompt: `Based on "${parentPrompt}" - Generated response here...`,
          onGenerate: (id: string, title: string, prompt: string) => generateNewNode(id, title, prompt),
        },
      };

      return nds.concat(newNode);
    });

    setEdges((eds: Edge[]) => {
      const newEdge: Edge = {
        id: `edge-${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      };
      return eds.concat(newEdge);
    });

    setNodeId(prev => prev + 1);
  }, []);

  // Initialize nodes with generate function
  useEffect(() => {
    setNodes((nds: Node[]) =>
      nds.map((node: Node) => ({
        ...node,
        data: {
          ...node.data,
          onGenerate: generateNewNode,
        },
      }))
    );
  }, []); // Empty dependency array - only run once on mount

  // Handle edge connections
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  );

  // Add new root node
  const addNewRootNode = useCallback(() => {
    const newNodeId = nodeId.toString();
    const newNode: Node = {
      id: newNodeId,
      type: 'ideaNode',
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 200 + 100,
      },
      data: {
        title: 'New Idea',
        prompt: '',
        onGenerate: generateNewNode,
      },
    };

    setNodes((nds: Node[]) => nds.concat(newNode));
    setNodeId(prev => prev + 1);
  }, [nodeId, generateNewNode, setNodes]);

  return (
    <div className="w-full h-screen bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm border-b p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Idea Mindmap</h1>
            <p className="text-sm text-gray-600">Brainstorm and generate ideas dynamically</p>
          </div>
          <button
            onClick={addNewRootNode}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Idea</span>
          </button>
        </div>
      </div>

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
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
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
          <li>• Edit node titles and prompts</li>
          <li>• Click "Generate" to create connected ideas</li>
          <li>• Drag nodes to reorganize</li>
          <li>• Use controls to zoom and pan</li>
          <li>• Add new root ideas with the "+" button</li>
        </ul>
      </div>
    </div>
  );
}