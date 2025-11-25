// Core data models for StudyEarn platform

export type UserRole = 'learner' | 'instructor' | 'institution' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  verifiedBadges: string[];
  isKYCVerified: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  institutionId?: string;
  thumbnail?: string;
  lessons: Lesson[];
  status: 'draft' | 'published' | 'archived';
  totalReward: number;
  enrolledCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  type: 'video' | 'text' | 'interactive';
  duration: number; // in minutes
  reward: number;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number;
  reward: number;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface Submission {
  id: string;
  userId: string;
  quizId?: string;
  lessonId?: string;
  type: 'quiz' | 'evidence' | 'assignment';
  content: any;
  attachments?: string[];
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  reviewedBy?: string;
  reviewedAt?: Date;
  feedback?: string;
}

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  status: 'approved' | 'rejected' | 'revision_requested';
  feedback: string;
  timestamp: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  totalEarned: number;
  totalWithdrawn: number;
  totalRedeemed: number;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'earn' | 'withdraw' | 'redeem' | 'referral' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  source: string;
  description: string;
  timestamp: Date;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  image: string;
  pointsRequired: number;
  category: string;
  inStock: boolean;
  redemptionCount: number;
}

export interface Redemption {
  id: string;
  userId: string;
  itemId: string;
  pointsSpent: number;
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  requestedAt: Date;
  fulfilledAt?: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId?: string;
  code: string;
  status: 'pending' | 'completed';
  bonusEarned: number;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  adminId: string;
  type: 'study_group' | 'cohort' | 'community';
  createdAt: Date;
}

export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  isPinned: boolean;
  timestamp: Date;
}

export interface Institution {
  id: string;
  name: string;
  domain: string;
  adminId: string;
  verified: boolean;
  cohorts: Cohort[];
  rewardPolicies: RewardPolicy[];
  createdAt: Date;
}

export interface Cohort {
  id: string;
  institutionId: string;
  name: string;
  studentIds: string[];
  startDate: Date;
  endDate: Date;
}

export interface RewardPolicy {
  id: string;
  institutionId: string;
  action: string;
  rewardAmount: number;
  conditions: Record<string, any>;
}

export interface AdminSettings {
  id: string;
  minWithdrawal: number;
  maxWithdrawal: number;
  verificationRequired: boolean;
  maintenanceMode: boolean;
  updatedBy: string;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  userId: string;
  lessonId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  activityLogs: ActivityLog[];
  proctored: boolean;
  status: 'active' | 'completed' | 'interrupted';
}

export interface ActivityLog {
  timestamp: Date;
  action: string;
  details: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  points: number;
  rank: number;
  streak: number;
  badges: string[];
}
