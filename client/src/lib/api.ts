import { apiRequest } from './queryClient';

export interface Module {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  order: number;
  icon: string;
  accentColor: string;
  duration: string;
  topics: string[];
  status?: 'locked' | 'in-progress' | 'completed';
  prerequisites?: number[];
  progress?: number;
  image?: string;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  order: number;
  moduleId: number;
  duration: number;
  quizId: number | null;
}

export interface LessonResponse {
  lesson: Lesson;
  module: {
    id: number;
    title: string;
    accentColor: string;
  };
  navigation: {
    prev: { id: number; title: string } | null;
    next: { id: number; title: string } | null;
  };
}

export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  passingScore: number;
  lessonId: number | null;
}

export interface QuizQuestion {
  id: number;
  text: string;
  type: string;
  order: number;
  points: number;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string | null;
}

export interface QuizAttempt {
  id: number;
  startedAt: Date;
  completedAt: Date | null;
  score: number;
  passed: boolean;
  timeTaken: number | null;
}

export interface QuizAnswer {
  questionId: number;
  selectedOptions: string[];
  isCorrect: boolean;
}

export interface UserProgress {
  moduleId: number;
  completed: boolean;
  lessonsCompleted: number;
  percentageComplete: number;
}

// Reward-related interfaces
export interface Reward {
  id: string;
  title: string;
  brand: string;
  value: string;
  pointsRequired: number;
  imageUrl: string;
  category: string;
}

export interface RewardTransaction {
  id: string;
  rewardId: string;
  rewardTitle: string;
  rewardValue: string;
  pointsSpent: number;
  redeemedAt: Date;
  status: 'pending' | 'fulfilled' | 'failed';
  code?: string;
}

// API functions
export const fetchModules = async (): Promise<{ modules: Module[] }> => {
  return apiRequest<{ modules: Module[] }>({
    url: '/api/learning/all-modules',
    method: 'GET'
  });
};

export const fetchModule = async (moduleId: number): Promise<{ 
  moduleTitle: string;
  moduleDescription: string;
  accentColor: string;
  lessons: { id: number; title: string; completed: boolean; duration: number }[];
}> => {
  return apiRequest<any>({
    url: `/api/learning/modules/${moduleId}/lessons`,
    method: 'GET'
  });
};

export const fetchLesson = async (lessonId: number): Promise<LessonResponse> => {
  return apiRequest<LessonResponse>({
    url: `/api/learning/lessons/${lessonId}`,
    method: 'GET'
  });
};

export const fetchQuiz = async (quizId: number): Promise<{
  quiz: Quiz;
  questions: QuizQuestion[];
}> => {
  return apiRequest<any>({
    url: `/api/quizzes/${quizId}`,
    method: 'GET'
  });
};

export const submitQuizAttempt = async (quizId: number, answers: { 
  questionId: number; 
  selectedOptions: string[] 
}[]): Promise<{
  attemptId: number;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
}> => {
  return apiRequest<any>({
    url: `/api/quizzes/${quizId}/attempt`,
    method: 'POST',
    data: { answers }
  });
};

export const fetchQuizAttempts = async (quizId: number): Promise<{
  attempts: QuizAttempt[];
}> => {
  return apiRequest<any>({
    url: `/api/quizzes/${quizId}/attempts`,
    method: 'GET'
  });
};

export const fetchQuizAttemptDetails = async (attemptId: number): Promise<{
  attempt: QuizAttempt;
  answers: QuizAnswer[];
  questions: QuizQuestion[];
}> => {
  return apiRequest<any>({
    url: `/api/quiz-attempts/${attemptId}`,
    method: 'GET'
  });
};

// Assistant API functions
export const fetchAssistantMessages = async (): Promise<{
  messages: { id: number; content: string; timestamp: Date; isUser: boolean }[];
}> => {
  return apiRequest<any>({
    url: '/api/assistant/messages',
    method: 'GET'
  });
};

export const sendAssistantMessage = async (message: string): Promise<{
  messages: { id: number; content: string; timestamp: Date; isUser: boolean }[];
}> => {
  return apiRequest<any>({
    url: '/api/assistant/message',
    method: 'POST',
    data: { message }
  });
};

export const checkAssistantStatus = async (): Promise<{
  configured: boolean;
  service?: string;
}> => {
  return apiRequest<any>({
    url: '/api/assistant/api-status',
    method: 'GET'
  });
};

export const fetchRewards = async (): Promise<{
  rewards: Reward[];
}> => {
  return await apiRequest('/api/rewards/available', { method: 'GET' });
};

export const redeemReward = async (rewardId: string): Promise<{
  transaction: RewardTransaction;
  remainingPoints: number;
}> => {
  return await apiRequest('/api/rewards/redeem', {
    method: 'POST',
    body: JSON.stringify({ rewardId }),
  });
};

export const fetchUserPoints = async (): Promise<{
  points: number;
  totalEarned: number;
  totalSpent: number;
}> => {
  return await apiRequest('/api/user/points', { method: 'GET' });
};

export const fetchRewardHistory = async (): Promise<{
  transactions: RewardTransaction[];
}> => {
  return await apiRequest('/api/rewards/history', { method: 'GET' });
};