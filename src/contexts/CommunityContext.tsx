import { createContext, useContext, useState, ReactNode } from 'react';

export interface Question {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  dislikes: number;
  replies: number;
  time: string;
  timestamp: Date;
  isBestAnswer: boolean;
  isCurrentUser?: boolean;
}

interface CommunityContextType {
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'timestamp' | 'time' | 'likes' | 'dislikes' | 'replies' | 'isBestAnswer'>) => void;
  voteQuestion: (id: string, type: 'up' | 'down') => void;
}

const defaultQuestions: Question[] = [
  {
    id: '1',
    author: 'Sarah Williams',
    avatar: '',
    title: 'Tips for mastering Python decorators?',
    content: "I'm struggling with understanding decorators in Python. Any resources or explanations that helped you?",
    category: 'Python',
    likes: 24,
    dislikes: 2,
    replies: 8,
    time: '2 hours ago',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isBestAnswer: false,
  },
  {
    id: '2',
    author: 'Michael Chen',
    avatar: '',
    title: 'Best practices for learning Data Structures',
    content: 'What approach did you find most effective when learning DSA? Looking for study tips!',
    category: 'Data Structures',
    likes: 18,
    dislikes: 1,
    replies: 12,
    time: '5 hours ago',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isBestAnswer: true,
  },
  {
    id: '3',
    author: 'Emma Davis',
    avatar: '',
    title: 'Study group for Web Development?',
    content: 'Anyone interested in forming a study group for the Web Dev Fundamentals course?',
    category: 'Web Development',
    likes: 32,
    dislikes: 0,
    replies: 15,
    time: '1 day ago',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isBestAnswer: false,
  },
];

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);

  const addQuestion = (
    question: Omit<Question, 'id' | 'timestamp' | 'time' | 'likes' | 'dislikes' | 'replies' | 'isBestAnswer'>
  ) => {
    const newQuestion: Question = {
      ...question,
      id: `user-${Date.now()}`,
      timestamp: new Date(),
      time: 'Just now',
      likes: 0,
      dislikes: 0,
      replies: 0,
      isBestAnswer: false,
      isCurrentUser: true,
    };

    setQuestions((prev) => [newQuestion, ...prev]);
  };

  const voteQuestion = (id: string, type: 'up' | 'down') => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              likes: type === 'up' ? q.likes + 1 : q.likes,
              dislikes: type === 'down' ? q.dislikes + 1 : q.dislikes,
            }
          : q
      )
    );
  };

  // Update time displays periodically
  const questionsWithUpdatedTime = questions.map((q) => ({
    ...q,
    time: formatTimeAgo(q.timestamp),
  }));

  return (
    <CommunityContext.Provider
      value={{
        questions: questionsWithUpdatedTime,
        addQuestion,
        voteQuestion,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
