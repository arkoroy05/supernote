"use client"

import React, { useEffect, useState } from 'react';
import { Plus, Search, Tag, ArrowRight, Network, Clock } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// interface Project {
//     id: string;
//     title: string;
//     lastEdited: Date;
//     tags: string[];
//     nodeCount: number;
//     nodeTypes: string[];
// }

interface ProjectCardProps {
    project: any;
    onOpenProject: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenProject }) => {
    const formatDate = (date: Date): string => {
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInHours < 168) {
            return `${Math.floor(diffInHours / 24)}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {project.name}
                    </h3>

                    {/* <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>Last edited {formatDate(project.lastEdited)}</span>
                    </div>

                    {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Network className="w-4 h-4 mr-1.5" />
                        <span>{project.nodeCount} nodes</span>
                        <span className="mx-2">•</span>
                        <span>{project.nodeTypes.join(', ')}</span>
                    </div> */}
                </div>

                <button
                    onClick={() => onOpenProject(project._id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group-hover:bg-blue-100"
                >
                    <span className="text-blue-700 font-medium">Open Project</span>
                    <ArrowRight className="w-4 h-4 text-blue-700 transform group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const ProjectDashboard: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [projects, setProjects] = useState<any[]>([]);
    const router = useRouter();

    // Dummy project data
    const dummyProjects: any[] = [
        {
            id: '1',
            title: 'AI-powered personalized tutor for high school students struggling with physics',
            lastEdited: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            tags: ['Education', 'AI', 'Physics'],
            nodeCount: 12,
            nodeTypes: ['Analysis', 'Variations', 'Research']
        },
        {
            id: '2',
            title: 'Sustainable urban farming platform for apartment dwellers',
            lastEdited: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            tags: ['Sustainability', 'Urban', 'Agriculture'],
            nodeCount: 8,
            nodeTypes: ['Concept', 'Market Research']
        },
        {
            id: '3',
            title: 'Mental health support app using peer-to-peer connections',
            lastEdited: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            tags: ['Healthcare', 'Mental Health', 'Social'],
            nodeCount: 15,
            nodeTypes: ['Analysis', 'User Research', 'Technical']
        },
        {
            id: '4',
            title: 'Blockchain-based supply chain transparency tool',
            lastEdited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            tags: ['Blockchain', 'Supply Chain', 'Transparency'],
            nodeCount: 6,
            nodeTypes: ['Concept', 'Analysis']
        },
        {
            id: '5',
            title: 'AR-powered interior design assistant for small spaces',
            lastEdited: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
            tags: ['AR', 'Design', 'Technology'],
            nodeCount: 10,
            nodeTypes: ['Research', 'Prototyping', 'Analysis']
        },
        {
            id: '6',
            title: 'Community-driven local news platform',
            lastEdited: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
            tags: ['Media', 'Community', 'News'],
            nodeCount: 9,
            nodeTypes: ['Market Analysis', 'Content Strategy']
        }
    ];

    // const filteredDummyProjects = dummyProjects.filter(project =>
    //     project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    // );

    const handleNewProject = (): void => {
        window.location.href = '/starting';
    };

    const handleOpenProject = (id: string): void => {
        window.location.href = `/graph/${id}`;
    };


    const loadProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project`, { withCredentials: true });
            if (response?.data) {
                // localStorage.setItem('ideaAnalysisData', JSON.stringify(response.data));
                // console.log(response.data);
                setProjects(response.data as any[]);
            }
            setLoading(false);
        }
        catch (error: unknown) {
            const errorData = error instanceof Error
                ? { message: error.message }
                : axios.isAxiosError(error) && error.response
                    ? error.response.data
                    : { message: 'An unknown error occurred' };
            console.log(JSON.stringify(errorData, null, 2));
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            {/* Top Bar */}
            <div className="bg-white border-b border-blue-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-blue-600">Supernote</h1>
                            </div>
                        </div>

                        <button
                            onClick={handleNewProject}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Project
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-black mb-2">Your Projects</h2>
                    <p className="text-gray-600">Manage and explore your idea graphs</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, ) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onOpenProject={handleOpenProject}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {/* {filteredDummyProjects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-black mb-2">No projects found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={handleNewProject}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Your First Project
                            </button>
                        )}
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default ProjectDashboard;