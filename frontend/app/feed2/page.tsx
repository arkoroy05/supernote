"use client"

import React, { useState } from 'react';
import { Wallet, Plus, ThumbsUp, ThumbsDown, Users, Coins, Clock, CheckCircle, XCircle } from 'lucide-react';

interface GrantRequest {
    id: number;
    author: string;
    useCase: string;
    amount: number;
    nodes: string[];
    votes: { up: number; down: number };
    timeLeft: string;
    status: 'voting' | 'approved' | 'rejected';
    hasVoted: boolean;
}

type VoteType = 'up' | 'down';

const GrantFeed = () => {
    const [walletConnected, setWalletConnected] = useState<boolean>(false);
    const [isStaker, setIsStaker] = useState<boolean>(false);
    const [showStakeModal, setShowStakeModal] = useState<boolean>(false);
    const [showGrantModal, setShowGrantModal] = useState<boolean>(false);
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
    const [grantAmount, setGrantAmount] = useState<string>('0.05');
    const [useCase, setUseCase] = useState<string>('');

    // Mock data
    const poolBalance = 4.3;
    const totalStakers = 127;
    const minVotes = 10;
    const approvalThreshold = 70;

    const [grantRequests, setGrantRequests] = useState<GrantRequest[]>([
        {
        id: 1,
        author: '0x1234...5678',
        useCase: 'Need to run ad test for DeFi onboarding flow',
        amount: 0.05,
        nodes: ['User Research', 'Ad Testing', 'Growth'],
        votes: { up: 8, down: 1 },
        timeLeft: '2d 4h',
        status: 'voting',
        hasVoted: false
        },
        {
        id: 2,
        author: '0x9abc...def0',
        useCase: 'Building privacy-focused social feed algorithm',
        amount: 0.05,
        nodes: ['Algorithm', 'Privacy', 'Social'],
        votes: { up: 12, down: 2 },
        timeLeft: '1d 12h',
        status: 'approved',
        hasVoted: true
        },
        {
        id: 3,
        author: '0x5678...9abc',
        useCase: 'Research: Web3 UX patterns for mainstream adoption',
        amount: 0.05,
        nodes: ['UX Research', 'Web3', 'Adoption'],
        votes: { up: 3, down: 8 },
        timeLeft: '5h 23m',
        status: 'rejected',
        hasVoted: true
        }
    ]);

    const handleStake = () => {
        setIsStaker(true);
        setWalletConnected(true);
        setShowStakeModal(false);
    };

    const handleVote = (requestId: number, voteType: VoteType) => {
        setGrantRequests(prev => prev.map(req => {
        if (req.id === requestId && !req.hasVoted) {
            const newVotes = { ...req.votes };
            newVotes[voteType]++;
            const totalVotes = newVotes.up + newVotes.down;
            const approvalRate = (newVotes.up / totalVotes) * 100;
            
            let newStatus: 'voting' | 'approved' | 'rejected' = req.status;
            if (totalVotes >= minVotes) {
            newStatus = approvalRate >= approvalThreshold ? 'approved' : 'rejected';
            }
            
            return {
            ...req,
            votes: newVotes,
            hasVoted: true,
            status: newStatus
            };
        }
        return req;
        }));
    };

    const handleCreateGrant = () => {
        if (!useCase.trim()) return;
        
        const newGrant: GrantRequest = {
        id: Date.now(),
        author: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4),
        useCase,
        amount: parseFloat(grantAmount),
        nodes: selectedNodes,
        votes: { up: 0, down: 0 },
        timeLeft: '7d 0h',
        status: 'voting',
        hasVoted: false
        };
        
        setGrantRequests(prev => [newGrant, ...prev]);
        setShowGrantModal(false);
        setUseCase('');
        setSelectedNodes([]);
    };

    const getStatusColor = (status: 'voting' | 'approved' | 'rejected') => {
        switch (status) {
        case 'approved': return 'text-green-600 bg-green-50';
        case 'rejected': return 'text-red-600 bg-red-50';
        default: return 'text-blue-600 bg-blue-50';
        }
    };

    const getStatusIcon = (status: 'voting' | 'approved' | 'rejected') => {
        switch (status) {
        case 'approved': return <CheckCircle className="w-4 h-4" />;
        case 'rejected': return <XCircle className="w-4 h-4" />;
        default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">/feed</h1>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4" />
                    <span className="font-medium">{poolBalance} ETH</span>
                    <span className="text-gray-400">pool</span>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{totalStakers}</span>
                    <span className="text-gray-400">stakers</span>
                    </div>
                </div>
                </div>
                
                <div className="flex items-center space-x-3">
                {!walletConnected ? (
                    <button
                    onClick={() => setWalletConnected(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                    </button>
                ) : !isStaker ? (
                    <button
                    onClick={() => setShowStakeModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                    Join Grant Pool
                    </button>
                ) : (
                    <>
                    <button
                        onClick={() => setShowGrantModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Request Grant</span>
                    </button>
                    <div className="w-3 h-3 bg-green-500 rounded-full" title="Staker"></div>
                    </>
                )}
                </div>
            </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Grant Requests */}
            <div className="space-y-6">
            {grantRequests.map(request => {
                const totalVotes = request.votes.up + request.votes.down;
                const approvalRate = totalVotes > 0 ? (request.votes.up / totalVotes) * 100 : 0;
                
                return (
                <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                        <div>
                        <p className="font-mono text-sm text-gray-600">{request.author}</p>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                        </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{request.amount} ETH</p>
                        <p className="text-sm text-gray-500">{request.timeLeft} left</p>
                    </div>
                    </div>

                    <div className="mb-4">
                    <p className="text-gray-900 mb-3">{request.useCase}</p>
                    <div className="flex flex-wrap gap-2">
                        {request.nodes.map(node => (
                        <span key={node} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {node}
                        </span>
                        ))}
                    </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{request.votes.up + request.votes.down}/{minVotes} votes</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((request.votes.up + request.votes.down) / minVotes * 100, 100)}%` }}
                            ></div>
                        </div>
                        </div>
                        <div className="text-sm text-gray-600">
                        {approvalRate.toFixed(0)}% approval
                        </div>
                    </div>

                    {isStaker && request.status === 'voting' && !request.hasVoted && (
                        <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handleVote(request.id, 'up')}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{request.votes.up}</span>
                        </button>
                        <button
                            onClick={() => handleVote(request.id, 'down')}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <ThumbsDown className="w-4 h-4" />
                            <span>{request.votes.down}</span>
                        </button>
                        </div>
                    )}

                    {request.hasVoted && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4" />
                        <span>Voted</span>
                        </div>
                    )}
                    </div>
                </div>
                );
            })}
            </div>
        </div>

        {/* Stake Modal */}
        {showStakeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Join Grant Pool</h2>
                <p className="text-gray-600 mb-6">
                Stake 0.01 ETH to become eligible to request grants and vote on community funding decisions.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Stake Amount</span>
                    <span className="font-bold">0.01 ETH</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gas Fee (est.)</span>
                    <span className="text-gray-600">~$3</span>
                </div>
                </div>
                <div className="flex space-x-3">
                <button
                    onClick={() => setShowStakeModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleStake}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Stake & Join
                </button>
                </div>
            </div>
            </div>
        )}

        {/* Grant Request Modal */}
        {showGrantModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Request Grant</h2>
                
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Use Case *
                    </label>
                    <textarea
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    placeholder="Brief description of what you need funding for..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grant Amount
                    </label>
                    <select
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                    <option value="0.05">0.05 ETH</option>
                    <option value="0.1">0.1 ETH</option>
                    <option value="0.2">0.2 ETH</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Context Nodes (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                    {['Research', 'Development', 'Marketing', 'Design', 'Testing', 'Community'].map(node => (
                        <button
                        key={node}
                        onClick={() => {
                            setSelectedNodes(prev => 
                            prev.includes(node) 
                                ? prev.filter(n => n !== node)
                                : [...prev, node]
                            );
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedNodes.includes(node)
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        >
                        {node}
                        </button>
                    ))}
                    </div>
                </div>
                </div>

                <div className="flex space-x-3 mt-6">
                <button
                    onClick={() => setShowGrantModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleCreateGrant}
                    disabled={!useCase.trim()}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Request
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default GrantFeed;