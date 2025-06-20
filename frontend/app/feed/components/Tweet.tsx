"use client";

import { useState } from "react";
import { TweetType, CommentType } from "../types";

interface TweetProps {
  tweet: TweetType;
}

interface CommentProps {
  comment: CommentType;
}

// Comment component
export function Comment({ comment }: CommentProps) {
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [downvotes, setDownvotes] = useState(comment.downvotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  
  const handleUpvote = () => {
    if (userVote === "up") {
      setUpvotes(upvotes - 1);
      setUserVote(null);
    } else {
      if (userVote === "down") {
        setDownvotes(downvotes - 1);
        setUpvotes(upvotes + 1);
      } else {
        setUpvotes(upvotes + 1);
      }
      setUserVote("up");
    }
  };
  
  const handleDownvote = () => {
    if (userVote === "down") {
      setDownvotes(downvotes - 1);
      setUserVote(null);
    } else {
      if (userVote === "up") {
        setUpvotes(upvotes - 1);
        setDownvotes(downvotes + 1);
      } else {
        setDownvotes(downvotes + 1);
      }
      setUserVote("down");
    }
  };
  
  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <img src={comment.user.avatar} alt={comment.user.name} className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="font-semibold text-sm mr-1">{comment.user.name}</span>
          <span className="text-[#6b7280] text-xs ml-1">
            {comment.user.username} · {comment.timestamp}
          </span>
        </div>
        
        <div className="mt-1 mb-2 text-sm">{comment.content}</div>
        
        <div className="flex space-x-4 text-[#6b7280] text-xs">
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleUpvote}
              className={`p-1 hover:bg-[rgba(59,130,246,0.1)] rounded ${userVote === "up" ? "text-[#3b82f6]" : ""}`}
            >
              <svg className="w-3.5 h-3.5" fill={userVote === "up" ? "currentColor" : "none"} viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth={2} d="M12 20V4m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
            <span>{upvotes}</span>
            <button 
              onClick={handleDownvote}
              className={`p-1 hover:bg-[rgba(239,68,68,0.1)] rounded ${userVote === "down" ? "text-[#ef4444]" : ""}`}
            >
              <svg className="w-3.5 h-3.5" fill={userVote === "down" ? "currentColor" : "none"} viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth={2} d="M12 4v16m0 0l7-7m-7 7l-7-7" />
              </svg>
            </button>
          </div>
          
          <button className="hover:text-[#3b82f6]">Reply</button>
        </div>
      </div>
    </div>
  );
}

// Tweet component
export function Tweet({ tweet }: TweetProps) {
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(tweet.likes);
  const [liked, setLiked] = useState(false);
  const [reshareCount, setReshareCount] = useState(tweet.reshares);
  const [reshared, setReshared] = useState(false);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };
  
  const handleReshare = () => {
    if (reshared) {
      setReshareCount(reshareCount - 1);
    } else {
      setReshareCount(reshareCount + 1);
    }
    setReshared(!reshared);
  };
  
  return (
    <div className="p-4 hover:bg-[rgba(0,0,0,0.02)] cursor-pointer">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img src={tweet.user.avatar} alt={tweet.user.name} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-0.5">
            <span className="font-semibold mr-1">{tweet.user.name}</span>
            {tweet.user.verified && (
              <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-4 h-4 text-[#3b82f6] ml-0.5 mr-1">
                <g>
                  <path
                    fill="currentColor"
                    d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"
                  />
                </g>
              </svg>
            )}
            <span className="text-[#6b7280] text-sm ml-1">
              {tweet.user.username} · {tweet.timestamp}
            </span>
          </div>
          
          <div className="mt-1 mb-2 whitespace-pre-wrap">{tweet.content}</div>
          
          <div className="flex justify-between mt-3 text-[#6b7280] text-sm max-w-md">
            {/* Comment button */}
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center hover:text-[#3b82f6] group"
            >
              <div className="p-2 rounded-full group-hover:bg-[rgba(59,130,246,0.1)] mr-1">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <g>
                    <path
                      fill="currentColor"
                      d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
                    />
                  </g>
                </svg>
              </div>
              <span>{tweet.comments}</span>
            </button>
            
            {/* Reshare button */}
            <button 
              onClick={handleReshare}
              className={`flex items-center ${reshared ? "text-[#10b981]" : ""} hover:text-[#10b981] group`}
            >
              <div className="p-2 rounded-full group-hover:bg-[rgba(16,185,129,0.1)] mr-1">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <g>
                    <path
                      fill="currentColor"
                      d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                    />
                  </g>
                </svg>
              </div>
              <span>{reshareCount}</span>
            </button>
            
            {/* Like button */}
            <button 
              onClick={handleLike}
              className={`flex items-center ${liked ? "text-[#ef4444]" : ""} hover:text-[#ef4444] group`}
            >
              <div className="p-2 rounded-full group-hover:bg-[rgba(239,68,68,0.1)] mr-1">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <g>
                    <path
                      fill="currentColor"
                      d={liked 
                        ? "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                        : "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                      }
                    />
                  </g>
                </svg>
              </div>
              <span>{likeCount}</span>
            </button>
            
            {/* Share button */}
            <button className="flex items-center hover:text-[#3b82f6] group">
              <div className="p-2 rounded-full group-hover:bg-[rgba(59,130,246,0.1)]">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <g>
                    <path
                      fill="currentColor"
                      d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"
                    />
                  </g>
                </svg>
              </div>
            </button>
          </div>
          
          {/* Comments section */}
          {showComments && tweet.commentsList.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#e5e7eb] space-y-3">
              {tweet.commentsList.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 