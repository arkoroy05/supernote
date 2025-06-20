"use client"

import React, { useState } from 'react';
import { Wallet, ThumbsUp, ThumbsDown, Users, Coins, CheckCircle, XCircle, MessageCircle, Check, X } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

interface GrantRequest {
  id: number;
  author: string;
  useCase: string;
  amount: number;
  votes: { up: number; down: number };
  approvals: { approve: number; reject: number };
  status: 'voting' | 'approved' | 'rejected';
  userVote: 'up' | 'down' | null;
  hasApproved: boolean;
  comments: Comment[];
  nodes?: string[];
}

type VoteType = 'up' | 'down';
type ApprovalType = 'approve' | 'reject';

const GrantFeed = () => {
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [isStaker, setIsStaker] = useState<boolean>(false);
  const [showStakeModal, setShowStakeModal] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  // Mock data
  const poolBalance = 4.3;
  const totalStakers = 127;
  const minVotes = 10;
  const approvalThreshold = 70;

  const [grantRequests, setGrantRequests] = useState<GrantRequest[]>([
    {
      id: 1,
      author: 'Alex Chen',
      useCase: 'Need to run ad test for DeFi onboarding flow',
      amount: 0.05,
      votes: { up: 6, down: 1 },
      approvals: { approve: 3, reject: 1 },
      status: 'voting',
      userVote: null,
      hasApproved: false,
      comments: [
        { id: 1, author: 'Sarah Kim', text: 'This looks promising! What metrics will you track?', timestamp: '2h ago' },
        { id: 2, author: 'Marcus Johnson', text: 'Have you considered A/B testing different ad formats?', timestamp: '1h ago' }
      ]
    },
    {
      id: 2,
      author: 'Jordan Rivera',
      useCase: 'Building privacy-focused social feed algorithm',
      amount: 0.05,
      votes: { up: 8, down: 2 },
      approvals: { approve: 8, reject: 1 },
      status: 'voting',
      userVote: null,
      hasApproved: false,
      comments: [
        { id: 3, author: 'Emily Watson', text: 'Love the privacy focus! When do you expect to have a prototype?', timestamp: '3h ago' }
      ]
    },
    {
      id: 3,
      author: 'Priya Sharma',
      useCase: 'Research: Web3 UX patterns for mainstream adoption',
      amount: 0.05,
      votes: { up: 3, down: 5 },
      approvals: { approve: 2, reject: 4 },
      status: 'voting',
      userVote: null,
      hasApproved: false,
      comments: []
    }
  ]);

  const handleStake = () => {
    setIsStaker(true);
    setWalletConnected(true);
    setShowStakeModal(false);
  };

  const handleVote = (requestId: number, voteType: VoteType) => {
    setGrantRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const newVotes = { ...req.votes };
        
        // Remove previous vote if exists
        if (req.userVote === 'up') {
          newVotes.up--;
        } else if (req.userVote === 'down') {
          newVotes.down--;
        }
        
        // Add new vote or toggle off if same vote
        let newUserVote: 'up' | 'down' | null = null;
        if (req.userVote !== voteType) {
          newVotes[voteType]++;
          newUserVote = voteType;
        }
        
        return {
          ...req,
          votes: newVotes,
          userVote: newUserVote
        };
      }
      return req;
    }));
  };

  const handleApproval = (requestId: number, approvalType: ApprovalType) => {
    setGrantRequests(prev => prev.map(req => {
      if (req.id === requestId && !req.hasApproved) {
        const newApprovals = { ...req.approvals };
        newApprovals[approvalType]++;
        const totalApprovals = newApprovals.approve + newApprovals.reject;
        const approvalRate = (newApprovals.approve / totalApprovals) * 100;
        
        let newStatus: 'voting' | 'approved' | 'rejected' = req.status;
        if (totalApprovals >= minVotes) {
          newStatus = approvalRate >= approvalThreshold ? 'approved' : 'rejected';
        }
        
        return {
          ...req,
          approvals: newApprovals,
          hasApproved: true,
          status: newStatus
        };
      }
      return req;
    }));
  };

  const toggleComments = (requestId: number) => {
    setShowComments(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  const handleAddComment = (requestId: number) => {
    const commentText = newComment[requestId]?.trim();
    if (!commentText) return;

    const comment: Comment = {
      id: Date.now(),
      author: 'You',
      text: commentText,
      timestamp: 'now'
    };

    setGrantRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, comments: [...req.comments, comment] }
        : req
    ));

    setNewComment(prev => ({
      ...prev,
      [requestId]: ''
    }));
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
      default: return <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-pulse" />;
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
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" title="Staker"></div>
                </div>
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
            const totalApprovals = request.approvals.approve + request.approvals.reject;
            const approvalRate = totalApprovals > 0 ? (request.approvals.approve / totalApprovals) * 100 : 0;
            
            return (
              <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.author}</p>
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{request.amount} ETH</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-900 mb-3">{request.useCase}</p>
                  {request.nodes && request.nodes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {request.nodes.map(node => (
                        <span key={node} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {node}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Public Engagement */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleVote(request.id, 'up')}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                        request.userVote === 'up'
                          ? 'text-green-600 bg-green-50 border border-green-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{request.votes.up}</span>
                    </button>
                    <button
                      onClick={() => handleVote(request.id, 'down')}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                        request.userVote === 'down'
                          ? 'text-red-600 bg-red-50 border border-red-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{request.votes.down}</span>
                    </button>
                    <button 
                      onClick={() => toggleComments(request.id)}
                      className="flex items-center space-x-2 px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{request.comments.length}</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[request.id] && (
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <div className="space-y-3 mb-4">
                      {request.comments.map(comment => (
                        <div key={comment.id} className="flex space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-gray-900">{comment.author}</span>
                              <span className="text-xs text-gray-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-900">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Always show comment input - users are logged in via Google */}
                    <div className="flex space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={newComment[request.id] || ''}
                          onChange={(e) => setNewComment(prev => ({
                            ...prev,
                            [request.id]: e.target.value
                          }))}
                          placeholder="Add a comment..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(request.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(request.id)}
                          disabled={!newComment[request.id]?.trim()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Staker Approval Section */}
                {isStaker && (
                  <div className="pt-3 border-t border-gray-200 mt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="font-medium">Grant Approval:</span>
                          <span>{totalApprovals}/{minVotes} votes</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((totalApprovals) / minVotes * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {approvalRate.toFixed(0)}% approve
                        </div>
                      </div>

                      {request.status === 'voting' && !request.hasApproved && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApproval(request.id, 'approve')}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve</span>
                            <span className="text-xs">({request.approvals.approve})</span>
                          </button>
                          <button
                            onClick={() => handleApproval(request.id, 'reject')}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                            <span className="text-xs">({request.approvals.reject})</span>
                          </button>
                        </div>
                      )}

                      {request.hasApproved && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4" />
                          <span>You voted</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
              Stake 0.01 ETH to become eligible to vote on community funding decisions.
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
    </div>
  );
};

export default GrantFeed;