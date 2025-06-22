"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, ArrowRight, Network, Clock } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Interface for the project data received from the backend
interface Project {
    _id: string;
    name: string;
    updatedAt: string; // Mongoose provides this timestamp
    nodes: Array<{
        id: string;
        title: string;
        data?: Record<string, unknown>;
        position?: { x: number; y: number };
    }>;      // Array of nodes to get the count
    // You can add more properties like 'tags' if you add them to your backend schema
}

interface ProjectCardProps {
    project: Project;
    onOpenProject: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenProject }) => {
    // Helper function to format the 'updatedAt' date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "just now";
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group">
            <div className="flex flex-col h-full">
                <div className="flex-1 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                        {project.name}
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Network className="w-4 h-4 mr-1.5" />
                        <span>{project.nodes.length} nodes</span>
                    </div>

                    <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1.5" />
                        <span>Last updated {formatDate(project.updatedAt)}</span>
                    </div>
                </div>

                <button
                    onClick={() => onOpenProject(project._id)}
                    className="w-full mt-auto flex items-center justify-center px-4 py-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 font-semibold rounded-lg transition-colors duration-200"
                >
                    Open Project
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const ProjectDashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const router = useRouter();

    // Fetch projects from the backend when the component mounts
    useEffect(() => {
        const loadProjects = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/project`, { withCredentials: true });
                if (response?.data) {
                    setProjects(response.data as Project[]);
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                // Optionally handle error state, e.g., show a toast notification
            } finally {
                setIsLoading(false);
            }
        };
        
        loadProjects();
    }, []);

    // Filter projects based on the search query
    const filteredProjects = useMemo(() => {
        if (!searchQuery) {
            return projects;
        }
        return projects.filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projects, searchQuery]);

    // Use router.push for smooth, client-side navigation
    const handleNewProject = (): void => {
        router.push('/starting'); // Navigate to your "new project" page
    };

    const handleOpenProject = (id: string): void => {
        router.push(`/graph/${id}`); // Navigate to the specific graph page
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Bar */}
           

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">Your Projects</h2>
                    <p className="text-gray-600">Manage and explore your idea graphs.</p>
                </div>

                <div className="mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search projects by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="text-center py-12">
                         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onOpenProject={handleOpenProject}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchQuery ? 'No Projects Found' : 'Your Dashboard is Empty'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first project.'}
                        </p>
                        {!searchQuery && (
                            <Button onClick={handleNewProject} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Your First Project
                            </Button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProjectDashboard;