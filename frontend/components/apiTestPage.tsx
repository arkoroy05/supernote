import React, { useState, useEffect, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';

// --- TYPE DEFINITIONS for TypeScript ---
interface User {
  name?: string;
  walletAddress?: string;
}

interface ApiResponse {
  isLoggedIn: boolean;
  user?: User;
  message?: string;
  // Add other possible response fields here
  [key: string]: any; 
}

// --- CONFIGURATION ---
const API_BASE_URL = 'http://localhost:5000';

// Create an Axios instance. `withCredentials: true` is ESSENTIAL for session cookies.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// --- THE REACT COMPONENT ---
export const SupernoteTesterPage: React.FC = () => {
  // --- STATE MANAGEMENT with TypeScript ---
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [idea, setIdea] = useState<string>('AI-powered meal planner for fitness goals');
  const [prompt, setPrompt] = useState<string>('Who are the main competitors?');
  const [file, setFile] = useState<File | null>(null);

  // --- HELPER FUNCTIONS ---
  const handleApiResponse = (response: any) => {
    console.log('API Response:', response);
    setApiResponse(JSON.stringify(response, null, 2)); // Pretty-print JSON
    setIsLoading(false);
  };

  const handleApiError = (error: any) => {
    console.error('API Error:', error);
    const errorData = error.response ? error.response.data : { message: error.message };
    setApiResponse(JSON.stringify(errorData, null, 2));
    setIsLoading(false);
  };

  const executeApiCall = async (apiFunction: () => Promise<AxiosResponse<any>>) => {
    setIsLoading(true);
    setApiResponse(null);
    try {
      const response = await apiFunction();
      handleApiResponse(response.data);
      // Automatically save project and node IDs for subsequent tests
      if (response.data?._id) setProjectId(response.data._id);
      if (response.data?.newNode?.id) setNodeId(response.data.newNode.id);
    } catch (error) {
      handleApiError(error);
    }
  };

  // --- API CALL FUNCTIONS ---

  // 1. Authentication
  const checkLoginStatus = () => executeApiCall(() => apiClient.get<ApiResponse>('/auth/status'));
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 2. Project Flow
  const analyzeIdea = () => executeApiCall(() => apiClient.post('/api/idea/analyze', { idea }));
  const createProject = () => executeApiCall(() => apiClient.post('/api/project', {
    name: "AI Meal Planner Project",
    nodes: [
      { id: "node_1", title: "Initial Idea", data: { label: idea }, position: { x: 100, y: 100 } },
      { id: "node_2", title: "Chosen Variation", data: { label: "Focus on plans for specific medical conditions." }, position: { x: 450, y: 100 } }
    ],
    edges: [{ id: "edge_1-2", source: "node_1", target: "node_2" }]
  }));
  const addNode = () => executeApiCall(() => apiClient.post(`/api/project/${projectId}/converse`, {
    parentNodeId: "node_2", prompt, useRAG: false, title: "Competitor Analysis", position: { x: 450, y: 250 }
  }));

  // 3. Advanced Features
  const updateRating = () => executeApiCall(() => apiClient.post(`/api/project/${projectId}/rate`));
  const regenerateNode = () => executeApiCall(() => apiClient.put(`/api/project/${projectId}/node/${nodeId}/regenerate`, {
    newPrompt: "Re-explain competitors, but focus on their pricing models."
  }));
  const synthesize = () => executeApiCall(() => apiClient.post(`/api/project/${projectId}/synthesize`));
  const deleteNode = () => executeApiCall(() => apiClient.delete(`/api/project/${projectId}/node/${nodeId}`));

  // 4. File Upload
  const uploadDocument = async () => {
    if (!file) { alert("Please select a file first."); return; }
    const formData = new FormData();
    formData.append('file', file);
    executeApiCall(() => apiClient.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Supernote API Tester</h1>
          <p className="text-gray-600 mt-2">A dashboard to test the Supernote backend features.</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Controls */}
          <div className="flex flex-col gap-6">
            {/* --- Authentication Section --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Authentication</h2>
              <p className="text-sm text-gray-500 mb-4">Login using your browser first by clicking the link, then test the status.</p>
              <div className="flex flex-wrap gap-4">
                <a href={`${API_BASE_URL}/auth/login`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                  Login with Civic
                </a>
                <a href={`${API_BASE_URL}/auth/logout`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                  Logout
                </a>
                <button onClick={checkLoginStatus} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-300">Check Status</button>
              </div>
            </div>

            {/* --- Project Workflow Section --- */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Project Workflow</h2>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Initial Idea:</label>
                <input type="text" value={idea} onChange={(e: ChangeEvent<HTMLInputElement>) => setIdea(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
                <button onClick={analyzeIdea} className="mt-2 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">A. Analyze Idea</button>
              </div>
              <button onClick={createProject} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">B. Create Project</button>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">New Prompt (from Variation node):</label>
                <input type="text" value={prompt} onChange={(e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />
                <button onClick={addNode} disabled={!projectId} className="mt-2 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed">C. Add Research Node</button>
              </div>
            </div>
            
            {/* --- Advanced Features & Document Upload --- */}
             <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. AI & Node Management</h2>
                <p className="text-sm text-gray-500">These actions require a Project and a Node to be created first.</p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={updateRating} disabled={!projectId} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-300">Rate Project</button>
                    <button onClick={synthesize} disabled={!projectId} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-300">Synthesize Report</button>
                    <button onClick={regenerateNode} disabled={!projectId || !nodeId} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-300">Regenerate Node</button>
                    <button onClick={deleteNode} disabled={!projectId || !nodeId} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-300">Delete Node</button>
                </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">4. Document Upload (RAG)</h2>
                <input type="file" onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                <button onClick={uploadDocument} className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Upload Document</button>
            </div>
          </div>
          
          {/* Right Panel: API Response */}
          <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">API Response</h2>
            {isLoading ? 
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Loading...</p>
              </div> : 
              <pre className="text-sm whitespace-pre-wrap break-all text-gray-300">{apiResponse || "Responses will appear here..."}</pre>
            }
          </div>
        </div>
      </div>
    </div>
  );
};