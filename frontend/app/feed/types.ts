export interface CommentType {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
}

export interface TweetType {
  id: number;
  user: {
    name: string;
    username: string;
    verified: boolean;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  reshares: number;
  comments: number;
  commentsList: CommentType[];
}

export interface TrendingTopicType {
  id: number;
  category: string;
  title: string;
  posts: string;
}
 