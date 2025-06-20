"use client";

// import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "../components/Sidebar";
import { TweetType, TrendingTopicType } from "../types";
import { useState } from "react";
import Link from "next/link";

// Mock data (should be replaced with real data/fetch in production)
const mockTweet: TweetType = {
  id: 1,
  user: {
    name: "Wormhole India",
    username: "@WH_India",
    verified: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wormhole"
  },
  content: "parante waali gali, delhi",
  timestamp: "6:02 PM · Jun 19, 2025",
  likes: 1,
  reshares: 0,
  comments: 1,
  commentsList: [
    {
      id: 1,
      user: {
        name: "Asif Khan",
        username: "@0xkhan_",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=asif"
      },
      content: "I'd say it's more of a tourist trap now—prices are up, and the chaos is real.",
      timestamp: "35m",
      upvotes: 6,
      downvotes: 0
    }
  ]
};

const relevantPeople = [
  {
    name: "Wormhole India",
    username: "@WH_India",
    verified: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wormhole",
    desc: "a community of contributors & builders in the @wormhole ecosystem, not officially affiliated to Wormhole",
    following: true
  },
  {
    name: "Asif Khan",
    username: "@0xkhan_",
    verified: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=asif",
    desc: "Here to reclaim alpha for myself and friends. Co-founder @3pochlabs Advisor @radarblock Prev core @0xPolygon",
    following: false
  }
];

const trendingTopics: TrendingTopicType[] = [
  { id: 1, category: "Politics · Trending", title: "#Khamenei", posts: "20.6K posts" },
  { id: 2, category: "Trending in India", title: "#MakkalVirodhaStalin", posts: "3,993 posts" },
  { id: 3, category: "Sports", title: "#Euro2024", posts: "12.1K posts" }
];

export default function TweetDetailPage() {
  // const { id } = useParams(); // Remove unused id
  const [reply, setReply] = useState("");

  // In real app, fetch tweet by id
  const tweet = mockTweet;

  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      {/* Left Sidebar (reuse from feed) */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-[240px] flex-1 flex flex-col items-center bg-white min-h-screen">
        <div className="w-full max-w-2xl border-x border-[#e5e7eb] min-h-screen">
          {/* Back button and Post label */}
          <div className="flex items-center px-4 py-3 border-b border-[#e5e7eb]">
            <Link href="/feed" className="mr-4 p-2 rounded-full hover:bg-[rgba(0,0,0,0.05)]">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1a1a1a]"><path d="M15.5 19l-7-7 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <span className="text-lg font-semibold">Post</span>
          </div>

          {/* Tweet detail */}
          <div className="flex px-6 pt-6 pb-2">
            <div className="flex-shrink-0">
              <img src={tweet.user.avatar} alt={tweet.user.name} className="h-12 w-12 rounded-full object-cover" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center">
                <span className="font-semibold text-base">{tweet.user.name}</span>
                {tweet.user.verified && (
                  <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-4 h-4 text-[#3b82f6] ml-1">
                    <g>
                      <path fill="currentColor" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                    </g>
                  </svg>
                )}
                <span className="text-[#6b7280] text-sm ml-2">{tweet.user.username}</span>
              </div>
              <div className="mt-1 text-base whitespace-pre-wrap">{tweet.content}</div>
              <div className="flex items-center space-x-2 text-xs text-[#6b7280] mt-2">
                <span>{tweet.timestamp}</span>
                <span>·</span>
                <span className="font-semibold">24 Views</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-around px-6 py-2 border-b border-[#e5e7eb] text-[#6b7280]">
            <div className="flex items-center space-x-1">
              <svg viewBox="0 0 24 24" className="w-5 h-5"><g><path fill="currentColor" d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></g></svg>
              <span>1</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg viewBox="0 0 24 24" className="w-5 h-5"><g><path fill="currentColor" d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></g></svg>
              <span>0</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg viewBox="0 0 24 24" className="w-5 h-5"><g><path fill="currentColor" d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></g></svg>
              <span>1</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg viewBox="0 0 24 24" className="w-5 h-5"><g><path fill="currentColor" d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></g></svg>
            </div>
          </div>

          {/* Reply box */}
          <div className="flex items-center px-6 py-4 border-b border-[#e5e7eb]">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="Profile" className="h-10 w-10 rounded-full object-cover" />
            <input
              type="text"
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Post your reply"
              className="ml-3 flex-1 bg-[#f8f9fa] border border-[#e5e7eb] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#3b82f6] placeholder-[#9ca3af]"
            />
            <Button className="ml-3 rounded-full px-6 py-2 font-medium bg-[#e5e7eb] text-[#1a1a1a] hover:bg-[#d1d5db]">Reply</Button>
          </div>

          {/* Comments */}
          <div className="divide-y divide-[#e5e7eb]">
            {tweet.commentsList.map((comment) => (
              <div key={comment.id} className="flex px-6 py-4">
                <div className="flex-shrink-0">
                  <img src={comment.user.avatar} alt={comment.user.name} className="h-10 w-10 rounded-full object-cover" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="font-semibold text-base">{comment.user.name}</span>
                    <span className="text-[#6b7280] text-sm ml-2">{comment.user.username} · {comment.timestamp}</span>
                  </div>
                  <div className="mt-1 text-base whitespace-pre-wrap">{comment.content}</div>
                  <div className="flex items-center space-x-6 text-[#6b7280] text-sm mt-2">
                    <div className="flex items-center space-x-1">
                      <svg viewBox="0 0 24 24" className="w-4 h-4"><g><path fill="currentColor" d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></g></svg>
                      <span>0</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg viewBox="0 0 24 24" className="w-4 h-4"><g><path fill="currentColor" d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></g></svg>
                      <span>0</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg viewBox="0 0 24 24" className="w-4 h-4"><g><path fill="currentColor" d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></g></svg>
                      <span>{comment.upvotes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Right sidebar */}
      <aside className="hidden lg:block w-[350px] p-4">
        <div className="sticky top-0 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 bg-[#f8f9fa] border border-[#e5e7eb] rounded-full text-sm focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          {/* Relevant people */}
          <Card className="p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-3">Relevant people</h2>
            <div className="space-y-4">
              {relevantPeople.map((person) => (
                <div key={person.username} className="flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <img src={person.avatar} alt={person.name} className="h-10 w-10 rounded-full object-cover" />
                    <div className="ml-3 min-w-0">
                      <div className="flex items-center">
                        <span className="font-semibold text-base truncate">{person.name}</span>
                        {person.verified && (
                          <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-4 h-4 text-[#3b82f6] ml-1">
                            <g>
                              <path fill="currentColor" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                            </g>
                          </svg>
                        )}
                        <span className="text-[#6b7280] text-sm ml-2 truncate">{person.username}</span>
                      </div>
                      <p className="text-xs text-[#6b7280] truncate">{person.desc}</p>
                    </div>
                  </div>
                  {person.following ? (
                    <Button className="ml-2 rounded-full px-4 py-1 bg-[#1a1a1a] text-white text-sm font-medium hover:opacity-90">Following</Button>
                  ) : (
                    <Button className="ml-2 rounded-full px-4 py-1 bg-white border border-[#e5e7eb] text-[#1a1a1a] text-sm font-medium hover:bg-[#f5f5f5]">Follow</Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* What's happening */}
          <Card className="p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-3">What&apos;s happening</h2>
            <div className="space-y-4">
              {trendingTopics.map((topic) => (
                <div key={topic.id} className="group cursor-pointer">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-[#9ca3af]">{topic.category}</p>
                      <p className="font-semibold text-sm mt-0.5">{topic.title}</p>
                      <p className="text-xs text-[#9ca3af] mt-0.5">{topic.posts}</p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full hover:bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </aside>
    </div>
  );
} 