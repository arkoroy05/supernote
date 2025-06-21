"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Info, Pencil, Sparkles, User, Lightbulb, Target, ArrowUp, ArrowLeft, BrainCircuit } from "lucide-react"
import axios from "axios";
import { Node } from "reactflow" // Import Node type

// Frontend Node Data Type
interface NodeData {
    title: string;
    description: string;
    fullContent?: string;
}

// Idea Type Definition
interface IdeaType {
    title: string;
    icon: React.ElementType;
}

const ideaTypes: IdeaType[] = [
    { title: "User Persona", icon: User },
    { title: "Core Feature", icon: Lightbulb },
    { title: "Target Market", icon: Target },
    { title: "Problem Statement", icon: Info },
    { title: "Solution Outline", icon: Check },
    { title: "Marketing Angle", icon: Sparkles },
];

export default function IdeaDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { id: currentNodeId } = params;

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [currentNode, setCurrentNode] = useState<Node<NodeData> | null>(null);
    const [projectId, setProjectId] = useState<string | null>(null);

    const [ideaTitle, setIdeaTitle] = useState("");
    const [ideaDescription, setIdeaDescription] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const [selectedIdeaType, setSelectedIdeaType] = useState<string | null>(null);
    const [ideationPrompt, setIdeationPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const storedNode = localStorage.getItem('selectedNode');
        const storedProjectId = localStorage.getItem('currentProjectId');

        if (storedNode && storedProjectId) {
            try {
                const parsedNode: Node<NodeData> = JSON.parse(storedNode);
                setCurrentNode(parsedNode);
                setProjectId(storedProjectId);
                setIdeaTitle(parsedNode.data.title);
                setIdeaDescription(parsedNode.data.fullContent || parsedNode.data.description);
            } catch (error) {
                console.error("Failed to parse node data from localStorage", error);
                setCurrentNode(null);
            }
        }
        setIsLoadingData(false);
    }, [currentNodeId]);

    const handleGenerateClick = async () => {
        if ((!ideationPrompt.trim() && !selectedIdeaType) || !projectId || !currentNode) {
            alert("Missing prompt, project ID, or current node context.");
            return;
        }

        setIsGenerating(true);

        const finalPrompt = selectedIdeaType
            ? `${selectedIdeaType}: ${ideationPrompt}`
            : ideationPrompt;
        
        const newPosition = {
            x: currentNode.position.x + 400,
            y: currentNode.position.y,
        };

        try {
            // The 'title' field is no longer sent; the backend will generate it.
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/${projectId}/converse`,
                {
                    parentNodeId: currentNode.id,
                    prompt: finalPrompt,
                    position: newPosition,
                },
                { withCredentials: true }
            );

            const { newNode } = response.data;

            if (newNode) {
                // Prepare the new node data (with the AI-generated title) for the next page
                const nextNodeForStorage: Node<NodeData> = {
                    id: newNode.id,
                    position: newNode.position,
                    data: {
                        title: newNode.title,
                        description: newNode.data.label,
                        fullContent: newNode.data.label,
                    },
                    type: 'ideaNode',
                };
                
                localStorage.setItem('selectedNode', JSON.stringify(nextNodeForStorage));
                // Force a full page navigation to the new node's page to reload all state
                window.location.href = `/idea/${newNode.id}`;
            }

        } catch (error) {
            console.error("Failed to create new node:", error);
            alert("An error occurred while generating the new idea. Please check the console.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!currentNode) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-8">
                <BrainCircuit className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Node Data Not Found</h1>
                <p className="text-gray-600 mb-6 max-w-md">Please return to the mindmap and select a node.</p>
                <Button onClick={() => router.push(projectId ? `/graph/${projectId}` : '/')} className="bg-blue-600 hover:bg-blue-700">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back to Graph
                </Button>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <Button onClick={() => router.push(`/graph/${projectId}`)} variant="outline" className="mb-4 bg-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Mindmap
                </Button>
                
                <div className="text-left space-y-4">
                    <div className="flex items-start gap-2">
                        {isEditingTitle ? (
                            <Textarea value={ideaTitle} onChange={(e) => setIdeaTitle(e.target.value)} className="text-4xl font-serif text-gray-900 leading-tight flex-grow bg-white" rows={2} />
                        ) : (
                            <h1 className="text-4xl font-serif text-gray-900 leading-tight">{ideaTitle}</h1>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => setIsEditingTitle(!isEditingTitle)} className="flex-shrink-0">
                            {isEditingTitle ? <Check className="w-6 h-6" /> : <Pencil className="w-5 h-5" />}
                        </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Badge className="bg-green-100 text-green-800 rounded-full px-3 py-1">🌍 Massive Market</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800 rounded-full px-3 py-1">⏰ Perfect Timing</Badge>
                        <Badge className="bg-blue-100 text-blue-800 rounded-full px-3 py-1">⚡ Unfair Advantage</Badge>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Idea Description</h3>
                                <Button variant="ghost" size="icon" onClick={() => setIsEditingDescription(!isEditingDescription)}>
                                    {isEditingDescription ? <Check className="w-6 h-6" /> : <Pencil className="w-5 h-5" />}
                                </Button>
                            </div>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {isEditingDescription ? (
                                    <Textarea value={ideaDescription} onChange={(e) => setIdeaDescription(e.target.value)} className="h-96 w-full bg-white" />
                                ) : (
                                    <p>{ideaDescription}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="max-w-4xl mx-auto space-y-6 mt-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-serif text-gray-900">Continue Ideating</h2>
                        <p className="text-lg text-gray-600 mt-2">Select a category or describe your own idea to generate the next node.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {ideaTypes.map((idea) => (
                            <button
                                key={idea.title}
                                onClick={() => setSelectedIdeaType(idea.title === selectedIdeaType ? null : idea.title)}
                                className={`p-4 bg-white border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center text-center focus:outline-none ${selectedIdeaType === idea.title ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            >
                                <idea.icon className={`w-7 h-7 mb-2 ${selectedIdeaType === idea.title ? 'text-blue-600' : 'text-blue-500'}`} />
                                <h3 className="text-sm font-semibold text-gray-800">{idea.title}</h3>
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-2 flex items-center w-full">
                            <Textarea
                                value={ideationPrompt}
                                onChange={(e) => setIdeationPrompt(e.target.value)}
                                placeholder={selectedIdeaType ? `Refine the "${selectedIdeaType}"...` : "Or generate a new node from a prompt..."}
                                className="flex-grow bg-transparent border-none text-base text-gray-800 resize-none focus:outline-none focus:ring-0 h-12 p-2"
                                rows={1}
                            />
                            <Button
                                onClick={handleGenerateClick}
                                disabled={(!ideationPrompt.trim() && !selectedIdeaType) || isGenerating}
                                className="ml-2 rounded-lg w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                            >
                                {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <ArrowUp className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}