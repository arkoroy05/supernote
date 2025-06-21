"use client"

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle, MessageCircle, Check, X,  Home } from 'lucide-react';
import { StakingStats } from '@/components/web3/StakingStats';
import { StakersList } from '@/components/web3/StakersList';

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
  const [isStaker, setIsStaker] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  // Mock data
  // These variables are currently unused but kept for future reference
  // const poolBalance = 4.3;
  // const totalStakers = 127;
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

  const handleJoinGrantPool = () => {
    // Set isStaker to true before redirecting
    setIsStaker(true);
    // Redirect to /staking
    window.location.href = '/staking';
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
    <div className="min-h-screen bg-white">
      <div className="w-full flex overflow-x-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-indigo-600">supernote</h1>
          </div>
          
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-medium">
              <Home className="w-5 h-5" />
              <span>Feed</span>
            </a>
          </nav>
          <StakersList/>
        </div>

        {/* Main Feed */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Grant Feed</h2>
              </div>
            </div>
          </div>

          {/* Grant Requests */}
          <div className="divide-y divide-gray-200">
            {grantRequests.map(request => {
              const totalApprovals = request.approvals.approve + request.approvals.reject;
              const approvalRate = totalApprovals > 0 ? (request.approvals.approve / totalApprovals) * 100 : 0;
              
              return (
                <div key={request.id} className="bg-white p-6 hover:bg-gray-50 transition-colors border-b border-gray-100">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex-shrink-0"></div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-sm font-bold text-gray-900">{request.author}</p>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="capitalize">{request.status}</span>
                        </div>
                        <div className="text-sm font-bold text-indigo-600">{request.amount} ETH</div>
                      </div>

                      <div className="mb-3">
                        <p className="text-gray-900 text-sm">{request.useCase}</p>
                        {request.nodes && request.nodes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {request.nodes.map(node => (
                              <span key={node} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {node}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Public Engagement */}
                      <div className="flex items-center space-x-4 mb-3">
                        <button
                          onClick={() => handleVote(request.id, 'up')}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-colors text-sm ${
                            request.userVote === 'up'
                              ? 'text-green-600 bg-green-50'
                              : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{request.votes.up}</span>
                        </button>
                        <button
                          onClick={() => handleVote(request.id, 'down')}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-colors text-sm ${
                            request.userVote === 'down'
                              ? 'text-red-600 bg-red-50'
                              : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>{request.votes.down}</span>
                        </button>
                        <button 
                          onClick={() => toggleComments(request.id)}
                          className="flex items-center space-x-1 px-2 py-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors text-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{request.comments.length}</span>
                        </button>
                      </div>

                      {/* Staker Approval Section */}
                      {isStaker && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <span className="font-medium">Grant Approval:</span>
                                <span>{totalApprovals}/{minVotes} votes</span>
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((totalApprovals) / minVotes * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600">
                                {approvalRate.toFixed(0)}% approve
                              </div>
                            </div>

                            {request.status === 'voting' && !request.hasApproved && (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleApproval(request.id, 'approve')}
                                  className="flex items-center space-x-1 px-2 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors text-xs"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>{request.approvals.approve}</span>
                                </button>
                                <button
                                  onClick={() => handleApproval(request.id, 'reject')}
                                  className="flex items-center space-x-1 px-2 py-1 bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors text-xs"
                                >
                                  <X className="w-3 h-3" />
                                  <span>{request.approvals.reject}</span>
                                </button>
                              </div>
                            )}

                            {request.hasApproved && (
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <CheckCircle className="w-3 h-3" />
                                <span>Voted</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Comments Section */}
                      {showComments[request.id] && (
                        <div className="mt-3 space-y-3">
                          {request.comments.map(comment => (
                            <div key={comment.id} className="flex space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                              <div className="flex-1 bg-gray-50 rounded-lg p-2">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-xs font-medium text-gray-900">{comment.author}</span>
                                  <span className="text-xs text-gray-400">{comment.timestamp}</span>
                                </div>
                                <p className="text-xs text-gray-900">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                          
                          {/* Comment Input */}
                          <div className="flex space-x-2 mt-3">
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
                                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddComment(request.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleAddComment(request.id)}
                                disabled={!newComment[request.id]?.trim()}
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-90 bg-white border-l border-gray-200 p-6">
          {/* Grant Pool Info */}
          {/* <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Grant Pool</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-gray-600">Pool Balance</span>
                </div>
                <span className="font-bold text-gray-900">{poolBalance} ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-gray-600">Total Stakers</span>
                </div>
                <span className="font-bold text-gray-900">{totalStakers}</span>
              </div>
            </div>
          </div> */}
          <StakingStats/>

          {/* Join Grant Pool / Profile */}
          {!isStaker ? (
            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Join the Grant Pool</h3>
              <p className="text-sm text-gray-600 mb-4">
                Stake ETH to vote on community funding decisions and help shape the future of Supernote.
              </p>
              <button
                onClick={handleJoinGrantPool}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Join Grant Pool
              </button>
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-900">Grant Pool Member</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Youre eligible to vote on grant approvals.
              </p>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                View My Profile
              </button>
            </div>
          )}

          {/* What's Happening */}
        </div>
      </div>
    </div>
  );
};

export default GrantFeed;