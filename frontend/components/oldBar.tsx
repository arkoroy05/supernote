"use client";

import React, { useState, useCallback, useEffect } from "react";
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
    Check,
    Info,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIdeaAccelerator } from "@/app/hooks";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants";
import { type Abi } from 'viem';
import { useAccount } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Extend Window interface to include our custom properties
declare global {
    interface Window {
        __handleCreateNode?: (nodeId: string) => void;
        __handleNodeClick?: (nodeId: string) => void;
    }
}

// Types for node data
interface NodeData {
    title: string;
    description: string;
    fullContent?: string;
}

// Define a proper type for the icon props
interface IconProps {
    className?: string;
    size?: number;
}

type ValidateAttribute = "userFlow" | "marketGap" | "usability" | "optimalSeo" | "monetization" | "scalability" | "technicalComplexity" | "differentiation" | "adoptionBarriers"

interface AttributeState {
  validated: boolean
  enabled: boolean
}

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
> = ({ data, id, onCreateNode, onNodeClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 w-[280px] hover:shadow-xl transition-shadow duration-200">
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-blue-500">
                <ChevronRight className="position-absolute w-5 h-5 text-[#8b5cf6] translate-x-[-63%] translate-y-[-40%]" />
            </Handle>

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
                    className="text-sm h-20 text-gray-600 line-clamp-4 cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => onNodeClick(id)}
                >
                    {data.description}
                </p>

                {/* Create Node Button */}
                <button
                    onClick={() => onCreateNode(id)}
                    className="w-[60%] justify-self-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 flex items-center justify-center space-x-2 transition-all duration-200"
                >
                    <WandSparkles className="w-4 h-4" />
                    <span>Ideate</span>
                </button>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-purple-500"
            />
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
    const [showPromptInput, setShowPromptInput] = useState(false);
    const [prompt, setPrompt] = useState("some default prompt");
    const [isGenerating, setIsGenerating] = useState(false);

    const resetModal = () => {
        setShowPromptInput(false);
        setPrompt("some default prompt");
        setIsGenerating(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
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
    
    const handleSelectIdeaItem = (title: string) => {
        onCreateManual(title, "some basic description about the title " + title);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Create Node from &ldquo;{parentTitle}&rdquo;
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Grid layout for idea types (3x3 grid) */}
                    <div className="grid grid-cols-3 gap-2">
                        {ideaTypes.map((idea: IdeaType) => (
                            <button
                                key={idea.title}
                                onClick={() => handleSelectIdeaItem(idea.title)}
                                className="p-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center text-center"
                            >
                                <idea.icon className="w-5 h-5 text-blue-500 mb-1" />
                                <h3 className="text-xs font-medium text-gray-900">{idea.title}</h3>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowPromptInput(!showPromptInput)}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left"
                    >
                        <div className="flex items-center space-x-3">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    Generate via Prompt
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Let AI create the node based on your prompt
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Prompt Input appears directly below the button */}
                    {showPromptInput && (
                        <div className="space-y-3 bg-purple-50 p-3 rounded-lg border border-purple-100">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full p-3 border border-purple-200 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Describe what you want the new node to be about..."
                            />
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
                window.__handleCreateNode?.(nodeId);
            }}
            onNodeClick={(nodeId: string) => {
                // This will be set by the parent component
                window.__handleNodeClick?.(nodeId);
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
    const [selectedParentId, setSelectedParentId] = useState<string>("");
    const [selectedParentTitle, setSelectedParentTitle] = useState<string>("");

    // Web3 related state
    const [showGrantRequest, setShowGrantRequest] = useState(false);
    const [grantAmount, setGrantAmount] = useState("");
    const [metadataURI, setMetadataURI] = useState("");
    const [aiSuggestion, setAiSuggestion] = useState("");
    
    // Validate section state
    const [validateAttributes, setValidateAttributes] = useState<Record<ValidateAttribute, AttributeState>>({
        userFlow: { validated: false, enabled: true },
        marketGap: { validated: false, enabled: false },
        usability: { validated: false, enabled: false },
        optimalSeo: { validated: false, enabled: false },
        monetization: { validated: false, enabled: false },
        scalability: { validated: false, enabled: false },
        technicalComplexity: { validated: false, enabled: false },
        differentiation: { validated: false, enabled: false },
        adoptionBarriers: { validated: false, enabled: false },
    });
    
    // Store results for each attribute
    const [resultsMap, setResultsMap] = useState<Record<ValidateAttribute, string>>({
        userFlow: "",
        marketGap: "",
        usability: "",
        optimalSeo: "",
        monetization: "",
        scalability: "",
        technicalComplexity: "",
        differentiation: "",
        adoptionBarriers: "",
    });
    
    // For showing result popups
    const [showResultsPopup, setShowResultsPopup] = useState(false);
    const [currentViewingAttribute, setCurrentViewingAttribute] = useState<ValidateAttribute | null>(null);
    
    // Web3 hooks
    const {
        useIsStaker,
        useRequestGrant,
    } = useIdeaAccelerator({
        contractAddress: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI as Abi,
    });

    const { data: isStaker } = useIsStaker();
    
    const {
        requestGrant,
        isPending,
        isConfirming,
        error
    } = useRequestGrant();

    // Get wallet connection status
    const { isConnected } = useAccount();

    // State for collapsible sections
    const [isIdeateOpen, setIsIdeateOpen] = useState(false);
    const [isEvaluateOpen, setIsEvaluateOpen] = useState(false);

    // Add evaluation state similar to the idea page
    const [evaluations,] = useState({
        opportunity: { score: 9, revealed: true },
        problem: { score: 10, revealed: true },
        feasibility: { score: 6, revealed: true },
        whyNow: { score: 9, revealed: true },
    });

    // Handle creating new nodes
    const handleCreateNode = useCallback(
        (parentId: string) => {
            console.log("Creating node from parent:", parentId);
            const parentNode = nodes.find((node) => node.id === parentId);
            if (parentNode) {
                setSelectedParentId(parentId);
                setSelectedParentTitle(parentNode.data.title);
                setModalOpen(true);
            }
        },
        [nodes]
    );

    // Handle node click to navigate to /idea
    const handleNodeClick = useCallback(
        (nodeId: string) => {
            console.log("Node clicked:", nodeId);
            router.push("/idea");
        },
        [router]
    );

    // Set global handlers for the node component
    useEffect(() => {
        window.__handleCreateNode = handleCreateNode;
        window.__handleNodeClick = handleNodeClick;

        return () => {
            delete window.__handleCreateNode;
            delete window.__handleNodeClick;
        };
    }, [handleCreateNode, handleNodeClick]);

    // Simulate fetching initial node from API
    const fetchInitialNode = useCallback(async () => {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const initialNode: Node<NodeData> = {
            id: "initial-node",
            type: "ideaNode",
            position: { x: 400, y: 200 },
            data: {
                title: "Building CreatorShield",
                description:
                    "A decentralized platform for creators to protect, enforce, and monetize brand deals using smart contracts and automation — no lawyers or middlemen.",
                fullContent:
                    "This is the main strategic node that was created from the previous page. It contains all the initial planning data and serves as the starting point for our mindmapping exercise.",
            },
        };

        setNodes([initialNode]);
        setIsLoading(false);
    }, [setNodes]);

    // Create node manually
    const createManualNode = useCallback(
        (title: string, description: string) => {
            const newNodeId = `node-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`;
            const parentNode = nodes.find((node) => node.id === selectedParentId);

            if (!parentNode) return;

            const newNode: Node<NodeData> = {
                id: newNodeId,
                type: "ideaNode",
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

            setNodes((nds) => [...nds, newNode]);

            const newEdge: Edge = {
                id: `edge-${selectedParentId}-${newNodeId}`,
                source: selectedParentId,
                target: newNodeId,
                // type: "bezier",
                animated: false,
                style: { stroke: "#3b82f6", strokeWidth: 2 },
            };

            setEdges((eds) => [...eds, newEdge]);
        },
        [selectedParentId, nodes, setNodes, setEdges]
    );

    // Create node from prompt
    const createNodeFromPrompt = useCallback(
        (prompt: string) => {
            const newNodeId = `node-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`;
            const parentNode = nodes.find((node) => node.id === selectedParentId);

            if (!parentNode) return;

            // Simulate AI generation
            const generatedTitle = `AI Generated: ${prompt.substring(0, 30)}...`;
            const generatedDescription = `This node was generated based on the prompt: "${prompt}". In a real implementation, this would contain AI-generated content relevant to your request.`;

            const newNode: Node<NodeData> = {
                id: newNodeId,
                type: "ideaNode",
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

            setNodes((nds) => [...nds, newNode]);

            const newEdge: Edge = {
                id: `edge-${selectedParentId}-${newNodeId}`,
                source: selectedParentId,
                target: newNodeId,
                // type: "bezier",
                animated: false,
                style: { stroke: "#8b5cf6", strokeWidth: 2 },
            };

            setEdges((eds) => [...eds, newEdge]);
        },
        [selectedParentId, nodes, setNodes, setEdges]
    );

    // Handle edge connections
    const onConnect = useCallback(
        (params: Edge | Connection) =>
            setEdges((eds: Edge[]) => addEdge(params, eds)),
        [setEdges]
    );

    // Fetch initial node on mount
    useEffect(() => {
        fetchInitialNode();
    }, [fetchInitialNode]);
    
    // Handle clicking on a validated attribute
    const handleValidatedAttributeClick = (attribute: ValidateAttribute) => {
        if (validateAttributes[attribute].validated) {
            setCurrentViewingAttribute(attribute);
            setShowResultsPopup(true);
        }
    };
    
    // Handle validation results from ideation process
    const handleIdeateValidate = (resultsText: string) => {
        // For demo purposes, let's validate the userFlow attribute
        const validateKey = "userFlow";
        
        // Update validation status
        setValidateAttributes((prev) => ({
            ...prev,
            [validateKey]: { validated: true, enabled: true },
        }));
        
        // Save the results text
        setResultsMap((prev) => ({
            ...prev,
            [validateKey]: resultsText || "This is a validated user flow for your idea. It shows how users will interact with your platform and the key touchpoints in their journey.",
        }));
        
        // Set an AI suggestion
        setAiSuggestion("Consider adding a guided onboarding process to help new users understand the value proposition immediately. This could increase conversion rates by an estimated 30% based on similar platforms.");
    };
    
    // Handle grant request
    const handleGrantRequest = () => {
        if (!grantAmount || !metadataURI) return;
        requestGrant(metadataURI, grantAmount);
    };

    const isLoading_grant = isPending || isConfirming;
    
    // Simulate validation on component mount for demo
    useEffect(() => {
        // After initial node loads, simulate a validation for demo purposes
        if (!isLoading) {
            setTimeout(() => {
                handleIdeateValidate("This idea has a clear user flow that guides both homeowners and contractors through the escrow process with clear milestones and verification points.");
            }, 2000);
        }
    }, [isLoading]);

    return (
        <div className="w-full h-screen bg-gray-50">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm border-b p-4">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Idea Mindmap</h1>
                        <p className="text-sm text-gray-600">
                            {isLoading
                                ? "Loading initial node..."
                                : 'Click on nodes to view details, use "Create Node From Here" to expand'}
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
                    {/* React Flow with right side panel */}
                    <div className="pt-20 h-full flex">
                        {/* Left side: React Flow */}
                        <div className="flex-grow h-full">
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
                                <Background
                                    variant={BackgroundVariant.Dots}
                                    gap={20}
                                    size={1}
                                    color="#e5e7eb"
                                />
                            </ReactFlow>
                        </div>
                        
                        {/* Right side: Collapsible panels */}
                        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto flex flex-col">
                            {/* Ideate Collapsible */}
                            <Collapsible 
                                open={isIdeateOpen} 
                                onOpenChange={setIsIdeateOpen}
                                className="border-b border-gray-200"
                            >
                                <CollapsibleTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center">
                                            <WandSparkles className="w-5 h-5 mr-2 text-purple-600" />
                                            <span className="font-semibold text-gray-900">Ideate</span>
                                        </div>
                                        {isIdeateOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-4 pb-4">
                                    <div className="space-y-2">
                                        {/* Validate Options */}
                                        {[
                                            { key: "userFlow" as ValidateAttribute, label: "User Flow" },
                                            { key: "marketGap" as ValidateAttribute, label: "Market Gap" },
                                            { key: "usability" as ValidateAttribute, label: "Usability" },
                                            { key: "optimalSeo" as ValidateAttribute, label: "Optimal SEO" },
                                            { key: "monetization" as ValidateAttribute, label: "Monetization" },
                                            { key: "scalability" as ValidateAttribute, label: "Scalability" },
                                            { key: "technicalComplexity" as ValidateAttribute, label: "Technical Complexity" },
                                            { key: "differentiation" as ValidateAttribute, label: "Differentiation" },
                                            { key: "adoptionBarriers" as ValidateAttribute, label: "Adoption Barriers" },
                                        ].map(({ key, label }) => (
                                            <Button
                                                key={key}
                                                variant="outline"
                                                disabled={!validateAttributes[key].enabled}
                                                onClick={() => handleValidatedAttributeClick(key)}
                                                className={`w-full justify-start h-12 ${
                                                    validateAttributes[key].validated
                                                        ? "bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                                                        : validateAttributes[key].enabled
                                                            ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                                                            : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                                                }`}
                                            >
                                                {validateAttributes[key].validated && <Check className="w-4 h-4 mr-2" />}
                                                {label}
                                            </Button>
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                            
                            {/* Evaluate Collapsible */}
                            <Collapsible 
                                open={isEvaluateOpen} 
                                onOpenChange={setIsEvaluateOpen}
                            >
                                <CollapsibleTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center">
                                            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                                            <span className="font-semibold text-gray-900">Evaluate</span>
                                        </div>
                                        {isEvaluateOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="p-4">
                                    <div className="space-y-3">
                                        {/* Opportunity Card */}
                                        <Card className="bg-green-50 border-0 shadow-sm cursor-pointer hover:shadow-md">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-medium text-gray-700">Opportunity</h3>
                                                    <Info className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <div className="text-3xl font-bold text-gray-800">{evaluations.opportunity.score}</div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    {evaluations.opportunity.score >= 9 ? "Exceptional" : 
                                                    evaluations.opportunity.score >= 7 ? "Strong" : 
                                                    evaluations.opportunity.score >= 5 ? "Moderate" : "Limited"}
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${evaluations.opportunity.score * 10}%` }}></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        
                                        {/* Problem Card */}
                                        <Card className="bg-red-50 border-0 shadow-sm cursor-pointer hover:shadow-md">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-medium text-gray-700">Problem</h3>
                                                    <Info className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <div className="text-3xl font-bold text-gray-800">{evaluations.problem.score}</div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    {evaluations.problem.score >= 9 ? "Severe Pain" : 
                                                    evaluations.problem.score >= 7 ? "Significant Issue" : 
                                                    evaluations.problem.score >= 5 ? "Moderate Issue" : "Minor Issue"}
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${evaluations.problem.score * 10}%` }}></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        
                                        {/* Feasibility Card */}
                                        <Card className="bg-blue-50 border-0 shadow-sm cursor-pointer hover:shadow-md">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-medium text-gray-700">Feasibility</h3>
                                                    <Info className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <div className="text-3xl font-bold text-gray-800">{evaluations.feasibility.score}</div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    {evaluations.feasibility.score >= 9 ? "Very Doable" : 
                                                    evaluations.feasibility.score >= 7 ? "Achievable" : 
                                                    evaluations.feasibility.score >= 5 ? "Challenging" : "Difficult"}
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${evaluations.feasibility.score * 10}%` }}></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        
                                        {/* Why Now Card */}
                                        <Card className="bg-orange-50 border-0 shadow-sm cursor-pointer hover:shadow-md">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-medium text-gray-700">Why Now</h3>
                                                    <Info className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <div className="text-3xl font-bold text-gray-800">{evaluations.whyNow.score}</div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    {evaluations.whyNow.score >= 9 ? "Perfect Timing" : 
                                                    evaluations.whyNow.score >= 7 ? "Good Time" : 
                                                    evaluations.whyNow.score >= 5 ? "Acceptable" : "Better Wait"}
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div className="bg-orange-600 h-1.5 rounded-full" style={{ width: `${evaluations.whyNow.score * 10}%` }}></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                            
                            {/* Help Info */}
                            <div className="p-4 bg-blue-50 mt-auto border-t border-blue-100">
                                <div className="flex items-start">
                                    <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                                    <p className="text-xs text-blue-700">
                                        Click on the buttons above to expand sections and interact with your idea.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
                        <h3 className="font-semibold text-gray-900 mb-2">How to use:</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Click any node to view full details</li>
                            <li>• Use Create Node From Here to expand ideas</li>
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
            
            {/* Results Popup */}
            <Dialog open={showResultsPopup} onOpenChange={setShowResultsPopup}>
                <DialogContent className="bg-white border border-gray-200 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            {currentViewingAttribute && currentViewingAttribute.charAt(0).toUpperCase() + currentViewingAttribute.slice(1).replace(/([A-Z])/g, ' $1')}
                        </DialogTitle>
                    </DialogHeader>
                    
                    {/* Stealth Pitch Section */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Stealth Pitch</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {currentViewingAttribute ? resultsMap[currentViewingAttribute] : "No results available"}
                        </p>
                    </div>

                    {/* AI Suggestion Section */}
                    <div className="mt-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">AI</span>
                            <h3 className="text-lg font-semibold text-gray-800">Suggestion</h3>
                        </div>
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                            <p className="text-gray-700 min-h-[120px] whitespace-pre-wrap">
                                {aiSuggestion || "AI suggestions will appear here..."}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-base font-semibold rounded-lg"
                            onClick={() => {
                                setShowGrantRequest(true)
                                setShowResultsPopup(false)
                            }}
                        >
                            Ask for Grant and Pitch
                        </Button>
                        <Button 
                            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2 text-base font-semibold rounded-lg"
                            onClick={() => {
                                setShowResultsPopup(false)
                            }}
                        >
                            Stealth Pitch Only
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            
            {/* Grant Request Modal */}
            <Dialog open={showGrantRequest} onOpenChange={setShowGrantRequest}>
                <DialogContent className="bg-white border border-gray-200 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">Request Grant</DialogTitle>
                    </DialogHeader>
                    
                    {!isConnected ? (
                        <div className="py-6 space-y-4">
                            <div className="text-center">
                                <p className="text-gray-700 mb-2">Please connect your wallet from the main navigation</p>
                                <p className="text-red-500 text-sm">You need to connect your wallet and stake at least 0.5 ETH to request grants</p>
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    onClick={() => setShowGrantRequest(false)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    ) : !isStaker ? (
                        <div className="py-6 space-y-4">
                            <div className="text-center">
                                <p className="text-gray-700 mb-2">Your wallet is connected, but you need to stake first</p>
                                <p className="text-red-500 text-sm">Stake at least 0.5 ETH to request grants</p>
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    onClick={() => setShowGrantRequest(false)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Go to Staking Page
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Input
                                    type="number"
                                    placeholder="Amount in ETH"
                                    value={grantAmount}
                                    onChange={(e) => setGrantAmount(e.target.value)}
                                    min="0.1"
                                    step="0.1"
                                />
                                <Textarea
                                    placeholder="IPFS URI or metadata link containing project details"
                                    value={metadataURI}
                                    onChange={(e) => setMetadataURI(e.target.value)}
                                    className="min-h-[120px]"
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-500">
                                    {error.message}
                                </div>
                            )}
                            
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={handleGrantRequest}
                                    disabled={isLoading_grant || !grantAmount || !metadataURI}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    {isLoading_grant ? "Submitting..." : "Submit Grant Request"}
                                </Button>
                                <Button
                                    onClick={() => setShowGrantRequest(false)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}