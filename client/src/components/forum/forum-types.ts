export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  slug: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  topicCount: number;
}

export interface ForumTopic {
  id: number;
  title: string;
  content: string;
  slug: string;
  userId: number;
  categoryId: number;
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  lastPostAt: string;
  postCount?: number;
  user?: {
    id: number;
    username: string;
    userLevel: string;
  };
}

export interface ForumPost {
  id: number;
  content: string;
  userId: number;
  topicId: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  reactionCount?: number;
  user?: {
    id: number;
    username: string;
    userLevel: string;
  };
}

export interface ForumReaction {
  id: number;
  type: string;
  userId: number;
  postId: number;
}