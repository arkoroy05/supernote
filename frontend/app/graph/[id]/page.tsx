"use client";

import React, { useState, useCallback, useEffect, use } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";
import {
    X,
    ChevronRight,
    WandSparkles,
    Workflow,
    MousePointerClick,
    Megaphone,
    HelpCircle,
    Coins,
    BarChart3,
    Cpu,
    Sparkles,
    ShieldAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Extend Window interface
declare global {
    interface Window {
        __handleCreateNode?: (nodeId: string) => void;
        __handleNodeClick?: (nodeId: string) => void;
    }
}

// Frontend Node Data Type
interface NodeData {
    title: string;
    description: string;
    fullContent?: string;
}

// Icon Props Type
interface IconProps {
    className?: string;
    size?: number;
}

// Idea Types Array
type IdeaType = { title: string; icon: React.FC<IconProps> };
const ideaTypes: IdeaType[] = [
    { title: "User Flow", icon: Workflow },
    { title: "Usability", icon: MousePointerClick },
    { title: "Marketing", icon: Megaphone },
    { title: "Need", icon: HelpCircle },
    { title: "Monetization", icon: Coins },
    { title: "Scalability", icon: BarChart3 },
    { title: "Technical Complexity", icon: Cpu },
    { title: "Differentiation", icon: Sparkles },
    { title: "Adoption Barriers", icon: ShieldAlert },
];

// Custom Node Component
const IdeaNode: React.FC<
    NodeProps<NodeData> & {
        onCreateNode: (nodeId: string) => void;
        onNodeClick: (nodeId: string) => void;
    }
> = ({ data, id, onCreateNode, onNodeClick }) => (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 w-[280px] hover:shadow-xl transition-shadow duration-200">
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500">
            <ChevronRight className="position-absolute w-5 h-5 text-[#8b5cf6] translate-x-[-63%] translate-y-[-40%]" />
        </Handle>
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => onNodeClick(id)}>
                {data.title}
            </h3>
            <p className="text-sm h-20 text-gray-600 line-clamp-4 cursor-pointer hover:text-gray-800" onClick={() => onNodeClick(id)}>
                {data.description}
            </p>
            <button onClick={() => onCreateNode(id)} className="w-[60%] justify-self-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 flex items-center justify-center space-x-2">
                <WandSparkles className="w-4 h-4" />
                <span>Ideate</span>
            </button>
        </div>
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-500" />
    </div>
);


// Node types mapping
const nodeTypes = {
    ideaNode: (props: NodeProps<NodeData>) => (
        <IdeaNode
            {...props}
            onCreateNode={(nodeId: string) => window.__handleCreateNode?.(nodeId)}
            onNodeClick={(nodeId: string) => window.__handleNodeClick?.(nodeId)}
        />
    ),
};

export default function GraphPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const router = useRouter();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ====================================================================
    // START OF MODIFICATION
    // ====================================================================
    const handleNodeClick = useCallback((nodeId: string) => {
        const clickedNode = nodes.find((node) => node.id === nodeId);
        if (clickedNode && projectId) {
            // Store the entire node object (for position, id) and the project ID
            localStorage.setItem('selectedNode', JSON.stringify(clickedNode));
            localStorage.setItem('currentProjectId', projectId);
            router.push(`/idea/${nodeId}`);
        } else {
            console.error("Could not navigate: Node or Project ID is missing.", { nodeId, projectId });
        }
    }, [nodes, router, projectId]);
    // ====================================================================
    // END OF MODIFICATION
    // ====================================================================

    const loadProject = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/${projectId}`, { withCredentials: true });
            if (response?.data) {
                setNodes(response.data.nodes.map((snode: any) => ({
                    id: snode.id,
                    type: "ideaNode",
                    position: { x: snode.position.x, y: snode.position.y },
                    data: {
                        title: snode.title || 'Untitled Node',
                        description: snode.data.label,
                        fullContent: snode.data.label,
                    },
                } as Node<NodeData>)));
                setEdges(response.data.edges.map((sedge: any) => ({
                    id: sedge.id,
                    source: sedge.source,
                    target: sedge.target,
                    animated: false,
                    style: { stroke: "#3b82f6", strokeWidth: 2 },
                } as Edge)));
            }
        } catch (error) {
            console.error("Error loading project:", error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId, setNodes, setEdges]);

    useEffect(() => {
        window.__handleNodeClick = handleNodeClick;
        return () => { delete window.__handleNodeClick; };
    }, [handleNodeClick]);

    useEffect(() => {
        if (projectId) {
            loadProject();
        }
    }, [projectId, loadProject]);

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Fetching Your Project Mindmap...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-gray-50">
            <div className="absolute top-4 left-4 z-10 bg-white shadow-lg rounded-lg p-4">
                <h1 className="text-xl font-bold text-gray-900">Idea Mindmap</h1>
                <p className="text-sm text-gray-600">Click a node to explore or expand upon it.</p>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-gray-50"
            >
                <Controls className="bg-white shadow-lg rounded-lg" />
                <MiniMap className="bg-white rounded-lg shadow-lg" nodeColor="#3b82f6" />
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
            </ReactFlow>
        </div>
    );
}