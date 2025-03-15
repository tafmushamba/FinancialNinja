/**
 * Forum Category interface
 */
export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon?: string | null;
  order?: number;
  slug?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  topicCount?: number; // Number of topics in the category
  color?: string; // Theme color for the category
}

/**
 * Forum Topic interface
 */
export interface ForumTopic {
  id: number;
  title: string;
  content: string;
  userId: number;
  categoryId: number;
  slug?: string;
  isPinned?: boolean | null;
  isLocked?: boolean | null;
  views?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  lastPostAt?: Date | null;
  postCount?: number; // Number of posts in the topic
  category?: ForumCategory; // Category the topic belongs to
  user?: ForumUser; // User who created the topic
}

/**
 * Forum Post interface
 */
export interface ForumPost {
  id: number;
  content: string;
  userId: number;
  topicId: number;
  isEdited?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  reactionCount?: number; // Total reactions to this post
  topic?: ForumTopic; // Topic the post belongs to
  user?: ForumUser; // User who created the post
  reactions?: ForumReaction[]; // List of reactions to this post
}

/**
 * Forum Reaction interface
 */
export interface ForumReaction {
  id: number;
  userId: number;
  postId: number;
  reactionType: string; // e.g., "like", "heart", "thumbsUp"
  createdAt?: Date | null;
  user?: ForumUser; // User who created the reaction
}

/**
 * Forum User interface (simplified from main User interface)
 */
export interface ForumUser {
  id: number;
  username: string;
  avatar?: string;
  userLevel?: string; // Level of the user (e.g., "Beginner", "Advanced")
  postCount?: number; // Number of posts by the user
  joinedAt?: Date; // When the user joined
}