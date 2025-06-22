"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Download, Eye, Edit3, FileText, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

export default function SynthesizePage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [markdown, setMarkdown] = useState('');
    const [isPreview, setIsPreview] = useState(true); // Default to preview mode
    const [isLoading, setIsLoading] = useState(true); // Page starts in loading state
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const loadReport = async () => {
            if (!projectId) return;

            setIsLoading(true);
            try {
                // First, check if the report was passed via localStorage
                const storedReport = localStorage.getItem('synthesizedReport');
                if (storedReport) {
                    setMarkdown(storedReport);
                    // Clear the item so it's not used again accidentally
                    localStorage.removeItem('synthesizedReport');
                } else {
                    // If not in localStorage, fetch it from the backend directly
                    console.log("No stored report found, fetching from backend...");
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project/${projectId}/synthesize`,
                        {},
                        { withCredentials: true }
                    );
                    if (response.data?.document) {
                        setMarkdown(response.data.document);
                    }
                }
            } catch (error) {
                console.error('Failed to load synthesized report:', error);
                setMarkdown('# Error\n\nCould not load the synthesized report. Please try again from the graph page.');
            } finally {
                setIsLoading(false);
            }
        };

        loadReport();
    }, [projectId]);

    const downloadAsPDF = async () => {
        // ... (This function remains the same as in your code)
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <h2 className="text-lg font-medium text-gray-700">Generating your report...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                             <Button variant="outline" size="icon" onClick={() => router.push(`/graph/${projectId}`)}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Synthesized Report</h1>
                                <p className="text-sm text-gray-500">Edit and refine your startup analysis</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
                                {isPreview ? <Edit3 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                {isPreview ? 'Edit' : 'Preview'}
                            </Button>
                            <Button onClick={downloadAsPDF} disabled={isDownloading} className="bg-indigo-600 hover:bg-indigo-700">
                                <Download className="w-4 h-4 mr-2" />
                                {isDownloading ? 'Generating...' : 'Download PDF'}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {isPreview ? (
                        <article className="prose prose-lg max-w-none p-8">
                            <ReactMarkdown>{markdown}</ReactMarkdown>
                        </article>
                    ) : (
                        <div className="p-6">
                            <Textarea
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none"
                                style={{ minHeight: '70vh' }}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}