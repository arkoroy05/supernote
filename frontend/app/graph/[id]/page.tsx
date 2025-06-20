"use client";

import React, { useState, useCallback, useEffect, use, useRef } from "react";
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
    ChevronDown,
    ChevronUp,
    Lightbulb,
    LoaderCircle,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";

import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RequestGrantButton } from "@/components/web3/RequestGrantButton";
import ModalDialog from "@/components/ModalDialog";

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
            <p
                className="text-sm h-20 text-gray-600 line-clamp-4 cursor-pointer hover:text-gray-800"
                onClick={() => onNodeClick(id)}
            >
                {data.description.replace(/[#*]/g, "")}
            </p>
            <button onClick={() => onCreateNode(id)} className="w-[60%] justify-self-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 flex items-center justify-center space-x-2">
                <WandSparkles className="w-4 h-4" />
                <span>Ideate</span>
            </button>
        </div>
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-500" />
    </div>
);

// Modal for creating new nodes from an existing node
const CreateNodeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onCreateFromPrompt: (prompt: string, title: string) => void;
    parentTitle: string;
}> = ({ isOpen, onClose, onCreateFromPrompt, parentTitle }) => {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedIdeaType, setSelectedIdeaType] = useState<string | null>(null);

    const handlePromptCreate = async () => {
        if (!prompt.trim() && !selectedIdeaType) return;
        setIsGenerating(true);
        const finalPrompt = selectedIdeaType ? `${selectedIdeaType}: ${prompt}` : prompt;
        // The backend will generate the real title, but we can pass a hint
        const titleHint = selectedIdeaType || "AI Generated Idea";

        try {
            await onCreateFromPrompt(finalPrompt, titleHint);
        } catch (error) {
            console.error("Creation failed", error);
        } finally {
            setIsGenerating(false);
            onClose(); // Close modal regardless of outcome
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        Create Node from &ldquo;{parentTitle}&rdquo;
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-3 gap-3">
                        {ideaTypes.map((idea) => (
                            <button
                                key={idea.title}
                                onClick={() => setSelectedIdeaType(idea.title === selectedIdeaType ? null : idea.title)}
                                className={`p-3 bg-white border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center text-center focus:outline-none ${selectedIdeaType === idea.title ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            >
                                <idea.icon className={`w-6 h-6 mb-2 ${selectedIdeaType === idea.title ? 'text-blue-600' : 'text-blue-500'}`} />
                                <h3 className="text-xs font-semibold text-gray-800">{idea.title}</h3>
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={selectedIdeaType ? `Describe the new "${selectedIdeaType}" node...` : "Or generate a new node from a prompt..."}
                            className="w-full p-3 border-gray-300 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <Button
                        onClick={handlePromptCreate}
                        disabled={(!prompt.trim() && !selectedIdeaType) || isGenerating}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {isGenerating ? "Generating..." : "Generate Node"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

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
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState<string>("");
    const [selectedParentTitle, setSelectedParentTitle] = useState<string>("");
    const [isIdeateOpen, setIsIdeateOpen] = useState(true);
    const [isEvaluateOpen, setIsEvaluateOpen] = useState(true);
    // const [evaluations] = useState({
    //     opportunity: { score: 9 },
    //     problem: { score: 10 },
    //     feasibility: { score: 6 },
    //     whyNow: { score: 9 },
    // });

    const [selectedValidatePresetItem, setSelectedValidatePresetItem] = useState<number>(-1);
    const [customValidatePrompt, setCustomValidatePrompt] = useState<string>("");
    const [generatingPitch, setGeneratingPitch] = useState(false);
    const [stealthPitchDialogOpen, setStealthPitchDialogOpen] = useState(false);
    const [stealthPitch, setStealthPitch] = useState<string>("");

    // const [evaluations] = useState({
    //     opportunity: { score: 9 },
    //     problem: { score: 10 },
    //     feasibility: { score: 6 },
    //     whyNow: { score: 9 },
    // });
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    interface ProjectRating {
        opportunity: number;
        problem: number;
        feasibility: number;
        why_now: number;
        feedback: string;
    }
    const [projectRating, setProjectRating] = useState<ProjectRating | null>(null);
    const [isRating, setIsRating] = useState(false);

    // 2. Function to trigger the rating update
    const triggerRatingUpdate = useCallback(async () => {
        if (!projectId) return;
        setIsRating(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/${projectId}/rate`,
                {},
                { withCredentials: true }
            );
            if (response.data && response.data.projectRating) {
                setProjectRating(response.data.projectRating);
            }
        } catch (error) {
            console.error("Failed to update project rating:", error);
        } finally {
            setIsRating(false);
        }
    }, [projectId]);





    const handleNodeClick = useCallback((nodeId: string) => {
        const clickedNode = nodes.find((node) => node.id === nodeId);
        if (clickedNode && projectId) {
            localStorage.setItem('selectedNode', JSON.stringify(clickedNode));
            localStorage.setItem('currentProjectId', projectId);
            router.push(`/idea/${nodeId}`);
        }
    }, [nodes, router, projectId]);

    const handleCreateNode = useCallback((parentId: string) => {
        const parentNode = nodes.find((node) => node.id === parentId);
        if (parentNode) {
            setSelectedParentId(parentId);
            setSelectedParentTitle(parentNode.data.title);
            setModalOpen(true);
        }
    }, [nodes]);

    const createNodeFromPrompt = useCallback(async (prompt: string, title: string) => {
        const parentNode = nodes.find(n => n.id === selectedParentId);
        if (!parentNode || !projectId) throw new Error("Parent node or project ID not found");

        const newPosition = { x: parentNode.position.x + 400, y: parentNode.position.y };

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/${projectId}/converse`,
            { parentNodeId: selectedParentId, prompt, title, position: newPosition },
            { withCredentials: true }
        );

        const { newNode, newEdge } = response.data;

        if (newNode && newEdge) {
            const frontendNode = {
                id: newNode.id,
                type: "ideaNode",
                position: newNode.position,
                data: { title: newNode.title, description: newNode.data.label, fullContent: newNode.data.label }
            };
            setNodes((nds) => [...nds, frontendNode]);
            setEdges((eds) => [...eds, { ...newEdge, style: { stroke: "#8b5cf6", strokeWidth: 2 } }]);
            triggerRatingUpdate();
        }
    }, [nodes, selectedParentId, projectId, setNodes, setEdges, triggerRatingUpdate]);

    const loadProject = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/${projectId}`, { withCredentials: true });
            if (response?.data) {
                setNodes(response.data.nodes.map((snode: { id: string, title: string, position: { x: number, y: number }, data: { label: string } }) => ({
                    id: snode.id,
                    type: "ideaNode",
                    position: { x: snode.position.x, y: snode.position.y },
                    data: {
                        title: snode.title || 'Untitled Node',
                        description: snode.data.label,
                        fullContent: snode.data.label,
                    },
                } as Node<NodeData>)));
                setEdges(response.data.edges.map((sedge: { id: string, source: string, target: string }) => ({
                    id: sedge.id,
                    source: sedge.source,
                    target: sedge.target,
                    animated: false,
                    style: { stroke: "#3b82f6", strokeWidth: 2 },
                } as Edge)));
                if (response.data.projectRating) {
                    setProjectRating(response.data.projectRating);
                }
            }
        } catch (error) {
            console.error("Error loading project:", error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId, setNodes, setEdges]);

    const lastUpdatePositionsRef = useRef<number | null>(null);


    const updateNodePositions = useCallback(async () => {
        const now = Date.now();
        if (lastUpdatePositionsRef.current && now - lastUpdatePositionsRef.current < 1000) {
            // Dismiss if last update was less than 2 seconds ago
            return;
        }
        lastUpdatePositionsRef.current = now;

        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/${projectId}/nodes/positions`,
                {
                    updates: nodes.map((node: Node) => ({
                        id: node.id,
                        position: { x: node.position.x, y: node.position.y }
                    }))
                }, { withCredentials: true });
        } catch (error) {
            console.error("Error loading project:", error);
        } finally {

        }
    }, [projectId, nodes]);

    const generateStealthPitch = useCallback(async (validationMetric: string) => {
        setGeneratingPitch(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/${projectId}/generate-pitch`,
                { validationMetric }, { withCredentials: true });

            if (response?.data) {
                // console.log(response.data);
                setStealthPitch(response.data.pitch);
                setStealthPitchDialogOpen(true);
            }
        } catch (error) {
            console.error("Error loading project:", error);
        } finally {
            setGeneratingPitch(false);
        }
    }, [projectId]);

    const postPitch = useCallback(async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stealth`,
                {
                    title: 'untitled',
                    pitch: stealthPitch,
                    amount: 0.05,
                }, { withCredentials: true });

            if (response?.data) {
                console.log(response.data);
            }
        } catch (error) {
            console.error("Error loading project:", error);
        }
    }, [stealthPitch]);

    useEffect(() => {
        window.__handleNodeClick = handleNodeClick;
        window.__handleCreateNode = handleCreateNode;
        return () => {
            delete window.__handleNodeClick;
            delete window.__handleCreateNode;
        };
    }, [handleNodeClick, handleCreateNode]);

    useEffect(() => {
        if (projectId) loadProject();
    }, [projectId, loadProject]);

    useEffect(() => {
        if (projectId) {
            const needsUpdate = localStorage.getItem('needsRatingUpdate');
            if (needsUpdate === 'true') {
                // Remove the flag immediately to prevent re-triggering on refresh
                localStorage.removeItem('needsRatingUpdate');
                // Call the function to hit the /rate endpoint and refresh scores
                triggerRatingUpdate();
            }
        }
    }, [projectId, triggerRatingUpdate]);

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const handleSynthesizeReport = async () => {
        if (!projectId) {
            alert("Project ID is missing.");
            return;
        }
        setIsSynthesizing(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/${projectId}/synthesize`,
                {},
                { withCredentials: true }
            );

            if (response.data?.document) {
                // Store the generated markdown in localStorage to pass it to the next page
                localStorage.setItem('synthesizedReport', response.data.document);
                // Navigate to the synthesize page for this project
                router.push(`/synthesize/${projectId}`);
            }
        } catch (error) {
            console.error("Failed to synthesize report:", error);
            alert("An error occurred while generating the report.");
        } finally {
            setIsSynthesizing(false);
        }
    };

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
        <div className="w-full h-screen bg-gray-100">

            <div className="flex h-full w-full">
                <div className="flex-grow h-full">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={(changes) => {
                            onNodesChange(changes);
                            updateNodePositions();
                        }}
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

                <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto flex flex-col shadow-2xl z-10">
                    <Collapsible open={isIdeateOpen} onOpenChange={setIsIdeateOpen} className="border-b border-gray-200">
                        <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left">
                            <div className="flex items-center gap-3">
                                <Lightbulb className="w-5 h-5 text-purple-600" />
                                <span className="text-base font-semibold text-gray-800">Stealth Pitch</span>
                            </div>
                            {isIdeateOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 pt-1 bg-slate-50/70">
                            <p className="text-sm text-gray-600 mb-4">A confidential approach to seeking investment or partnerships, where you quietly and selectively engage potential funders or collaborators without publicizing your intentions.</p>
                            {/* This section can be built out further with more functionality */}
                            <div className="w-full flex flex-col gap-2">

                                {ideaTypes.map((idea, index) => (
                                    <button
                                        key={idea.title}
                                        onClick={() => {
                                            if (selectedValidatePresetItem === index) {
                                                setSelectedValidatePresetItem(-1);
                                            }
                                            else {
                                                setSelectedValidatePresetItem(index);
                                            }
                                        }}
                                        className={`px-4 py-2 bg-white border-2 rounded-lg gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center text-center focus:outline-none  ${selectedValidatePresetItem === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                    >
                                        <idea.icon className={`w-5 h-5  ${selectedValidatePresetItem === index ? 'text-blue-600' : 'text-blue-500'}`} />
                                        <h3 className="text-sm font-semibold text-gray-800">{idea.title}</h3>
                                    </button>
                                ))}

                                {selectedValidatePresetItem === -1 ? <div className="flex items-center my-2">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div> :
                                    <div className="flex my-2">
                                        <span className="flex-shrink mx-4 text-gray-800 text-sm">Additional Instructions:</span>
                                    </div>}

                                <div className="relative">
                                    <input
                                        type="text"
                                        value={customValidatePrompt}
                                        onChange={(e) => setCustomValidatePrompt(e.target.value)}
                                        placeholder={selectedValidatePresetItem === -1 ? "Enter a custom prompt..." : "Enter additional instructions..."}
                                        className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-600 hover:border-gray-800 transition-all duration-200 text-sm"
                                    />
                                </div>

                                <Button
                                    onClick={() => {
                                        let validationMetric;
                                        if (selectedValidatePresetItem !== -1) {
                                            if (customValidatePrompt) {
                                                validationMetric = `Validation metric: ${ideaTypes[selectedValidatePresetItem].title} || Extra instructions: ${customValidatePrompt}`;
                                            }
                                            else {
                                                validationMetric = ideaTypes[selectedValidatePresetItem].title;
                                            }
                                        }
                                        else {
                                            validationMetric = customValidatePrompt;
                                        }
                                        generateStealthPitch(validationMetric);
                                        setGeneratingPitch(true);
                                    }}
                                    className="w-full my-1"
                                    disabled={generatingPitch}
                                >
                                    {generatingPitch ? <><LoaderCircle className="w-5 h-5 mr-1 spin-slow" />
                                        Generating...</> : <><Sparkles className="w-5 h-5 mr-1 " />
                                        Generate Stealth Pitch</>}
                                </Button>

                                <RequestGrantButton />
                            </div>

                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible open={isEvaluateOpen} onOpenChange={setIsEvaluateOpen} className="border-b border-gray-200">
                        <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                <span className="text-base font-semibold text-gray-800">Evaluate Idea Score</span>
                            </div>
                            {isRating ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            ) : (
                                isEvaluateOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 bg-slate-50/70 space-y-4">
                            {projectRating ? (
                                <>
                                    {/* <Card className="bg-green-50 border-green-200 shadow-sm"><CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-1"><h3 className="font-medium text-green-800">Opportunity</h3><span className="font-bold text-lg text-green-900">{evaluations.opportunity.score}/10</span></div>
                                        <div className="w-full bg-green-200 rounded-full h-1.5"><div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${evaluations.opportunity.score * 10}%` }}></div></div>
                                    </CardContent></Card>
                                    <Card className="bg-red-50 border-red-200 shadow-sm"><CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-1"><h3 className="font-medium text-red-800">Problem Severity</h3><span className="font-bold text-lg text-red-900">{evaluations.problem.score}/10</span></div>
                                        <div className="w-full bg-red-200 rounded-full h-1.5"><div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${evaluations.problem.score * 10}%` }}></div></div>
                                    </CardContent></Card>
                                    <Card className="bg-blue-50 border-blue-200 shadow-sm"><CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-1"><h3 className="font-medium text-blue-800">Feasibility</h3><span className="font-bold text-lg text-blue-900">{evaluations.feasibility.score}/10</span></div>
                                        <div className="w-full bg-blue-200 rounded-full h-1.5"><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${evaluations.feasibility.score * 10}%` }}></div></div>
                                    </CardContent></Card>
                                    <Card className="bg-orange-50 border-orange-200 shadow-sm"><CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-1"><h3 className="font-medium text-orange-800">Why Now?</h3><span className="font-bold text-lg text-orange-900">{evaluations.whyNow.score}/10</span></div>
                                        <div className="w-full bg-orange-200 rounded-full h-1.5"><div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${evaluations.whyNow.score * 10}%` }}></div></div>
                                    </CardContent></Card> */}

                                    <Card className="bg-white border-gray-200"><CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-1"><h3 className="font-medium text-gray-700">Opportunity</h3><span className="font-bold text-lg text-green-700">{projectRating.opportunity}/10</span></div>
                                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${projectRating.opportunity * 10}%` }}></div></div>
                                    </CardContent></Card>
                                    <Card className="bg-white border-gray-200"><CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-1"><h3 className="font-medium text-gray-700">Problem Severity</h3><span className="font-bold text-lg text-red-700">{projectRating.problem}/10</span></div>
                                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: `${projectRating.problem * 10}%` }}></div></div>
                                    </CardContent></Card>
                                    <Card className="bg-white border-gray-200"><CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-1"><h3 className="font-medium text-gray-700">Feasibility</h3><span className="font-bold text-lg text-blue-700">{projectRating.feasibility}/10</span></div>
                                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${projectRating.feasibility * 10}%` }}></div></div>
                                    </CardContent></Card>
                                    <Card className="bg-white border-gray-200"><CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-1"><h3 className="font-medium text-gray-700">Why Now?</h3><span className="font-bold text-lg text-orange-700">{projectRating.why_now}/10</span></div>
                                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{ width: `${projectRating.why_now * 10}%` }}></div></div>
                                    </CardContent></Card>

                                    <Card className="bg-white border-gray-200 mt-4">
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-gray-800 mb-3">AI Feedback</h3>
                                            <div className="text-sm text-gray-700 space-y-3">
                                                {projectRating.feedback.split('\n').map((line, index) => {
                                                    const isPro = line.toLowerCase().includes('pro:');
                                                    const isCon = line.toLowerCase().includes('con:');
                                                    if (!isPro && !isCon) return null;

                                                    const Icon = isPro ? ThumbsUp : ThumbsDown;
                                                    const color = isPro ? 'text-green-600' : 'text-red-600';

                                                    return (
                                                        <div key={index} className="flex items-start">
                                                            <Icon className={`w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0 ${color}`} />
                                                            <span>{line.replace(/pro:|con:/i, '').trim()}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500">Create a new node to generate the initial project evaluation.</p>
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                    <div className="p-4 mt-auto border-t border-gray-200">
                        <div className="p-4 mt-auto border-t border-gray-200 bg-white">
                            <Button
                                onClick={handleSynthesizeReport}
                                disabled={isSynthesizing}
                                className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                            >
                                {isSynthesizing ? 'Generating...' : 'Synthesize Full Report'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <CreateNodeModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreateFromPrompt={createNodeFromPrompt}
                parentTitle={selectedParentTitle}
            />
            <ModalDialog
                title="Stealth Pitch"
                content={stealthPitch}
                open={stealthPitchDialogOpen}
                setOpen={setStealthPitchDialogOpen}
                onConfirm={postPitch}
                onCancel={() => console.log('stealth pitch Cancelled')}
            />
        </div>
    );
}