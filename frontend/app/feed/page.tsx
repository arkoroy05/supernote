"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tweet } from "./components/Tweet";
import { Sidebar } from "./components/Sidebar";
import { TweetType, TrendingTopicType } from "./types";
import Link from "next/link";

// Mock data for tweets
const mockTweets: TweetType[] = [
  {
    id: 1,
    user: {
      name: "djcows",
      username: "@djcows",
      verified: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=djcows"
    },
    content: "do NOT vibe code a nuclear bomb",
    timestamp: "18h",
    likes: 2000,
    reshares: 88,
    comments: 53,
    commentsList: [
      {
        id: 101,
        user: {
          name: "TechGuru",
          username: "@techguru",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techguru"
        },
        content: "I would never!",
        timestamp: "17h",
        upvotes: 12,
        downvotes: 2
      }
    ]
  },
  {
    id: 2,
    user: {
      name: "IIT_FUN",
      username: "@iit_fun",
      verified: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=iitfun"
    },
    content: "IIT_FUN isn&apos;t a project.\nIt&apos;s not a brand.\nIt&apos;s a culture of builders.",
    timestamp: "2h",
    likes: 51,
    reshares: 5,
    comments: 3,
    commentsList: []
  },
  {
    id: 3,
    user: {
      name: "Mason Arditi",
      username: "@createdbymaseon",
      verified: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mason"
    },
    content: "introducing SaaS (Shower as a Service)\n\nCS majors only.",
    timestamp: "16h",
    likes: 178,
    reshares: 22,
    comments: 10,
    commentsList: [
      {
        id: 201,
        user: {
          name: "CodeWizard",
          username: "@codewizard",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=codewizard"
        },
        content: "Finally a service we needed!",
        timestamp: "15h",
        upvotes: 20,
        downvotes: 0
      },
      {
        id: 202,
        user: {
          name: "TechBro",
          username: "@techbro",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techbro"
        },
        content: "Is there an API for this?",
        timestamp: "14h",
        upvotes: 15,
        downvotes: 1
      }
    ]
  }
];

// Mock data for trending topics
const trendingTopics: TrendingTopicType[] = [
  { id: 1, category: "Entertainment", title: "#HBDKajalAggarwal", posts: "3,444 posts" },
  { id: 2, category: "Trending in India", title: "#RJBalaji", posts: "2,355 posts" },
  { id: 3, category: "Politics", title: "#pappudiwas", posts: "3,579 posts" },
  { id: 4, category: "Entertainment", title: "#MrunalThakur", posts: "2,163 posts" }
];

export default function FeedPage() {
  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-[240px] flex-1 border-x border-[#e5e7eb]">
        <div className="flex border-b border-[#e5e7eb]">
          <button className="flex-1 py-4 text-center hover:bg-[rgba(0,0,0,0.05)]">
            For you
          </button>
          <button className="flex-1 py-4 text-center text-[#6b7280] hover:bg-[rgba(0,0,0,0.05)]">
            Following
          </button>
        </div>

        <div className="divide-y divide-[#e5e7eb]">
          {/* Tweets feed */}
          {mockTweets.map((tweet) => (
            <Link key={tweet.id} href={`/feed/${tweet.id}`} className="block hover:bg-[rgba(0,0,0,0.02)] transition-colors">
              <Tweet tweet={tweet} />
            </Link>
          ))}
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

          {/* Subscribe box */}
          <Card className="p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-1">Subscribe to Premium</h2>
            <p className="text-sm text-[#6b7280] mb-4">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
            <Button className="bg-[#3b82f6] hover:opacity-90 rounded-full font-medium">
              Subscribe
            </Button>
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
