// Forum types for TypeScript type safety

export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  order: number;
  icon: string | null;
  topicCount?: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface ForumTopic {
  id: number;
  categoryId: number;
  title: string;
  content: string;
  slug: string;
  userId: number;
  views: number | null;
  postCount?: number;
  isPinned?: boolean | null;
  isLocked?: boolean | null;
  lastPostAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  username?: string;
  category?: {
    name: string;
    slug: string;
  };
}

export interface ForumPost {
  id: number;
  topicId: number;
  userId: number;
  content: string;
  isEdited?: boolean | null;
  reactionCount?: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  username?: string;
  userLevel?: string;
  reactions?: ForumReaction[];
}

export interface ForumReaction {
  id: number;
  postId: number;
  userId: number;
  reactionType: string;
  createdAt?: Date | null;
  username?: string;
}

export interface CreateTopicPayload {
  title: string;
  content: string;
  categoryId: number;
}

export interface CreatePostPayload {
  content: string;
  topicId: number;
}

export interface ReactPostPayload {
  postId: number;
  reactionType: string;
}