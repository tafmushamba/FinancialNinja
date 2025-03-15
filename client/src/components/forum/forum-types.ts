export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  order: number;
  icon: string | null;
  topicCount?: number;
  color?: string;
}

export interface ForumTopic {
  id: number;
  title: string;
  content: string;
  slug: string;
  userId: number;
  categoryId: number;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  views: number | null;
  isPinned: boolean | null;
  isLocked: boolean | null;
  postCount?: number;
  lastPostAt?: Date | string | null;
  user?: {
    id: number;
    username: string;
    userLevel?: string;
  };
}

export interface ForumPost {
  id: number;
  content: string;
  userId: number;
  topicId: number;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  isEdited: boolean | null;
  reactionCount?: number;
  user?: {
    id: number;
    username: string;
    userLevel?: string;
  };
}

export interface ForumReaction {
  id: number;
  userId: number;
  postId: number;
  reactionType: string;
  createdAt: Date | string | null;
}

export interface ReactionCounts {
  [key: string]: number;
}