export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  slug: string;
  order: number;
  topicCount?: number;
  color?: string;
}

export interface ForumTopic {
  id: number;
  title: string;
  content: string;
  userId: number;
  categoryId: number;
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  lastPostAt: Date | null;
  postCount?: number;
  user?: {
    id: number;
    username: string;
    avatar?: string;
  };
  category?: ForumCategory;
}

export interface ForumPost {
  id: number;
  content: string;
  userId: number;
  topicId: number;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  reactionCount?: number;
  user?: {
    id: number;
    username: string;
    avatar?: string;
  };
}

export interface ForumReaction {
  id: number;
  userId: number;
  postId: number;
  reactionType: string;
  createdAt: Date;
  user?: {
    id: number;
    username: string;
    avatar?: string;
  };
}