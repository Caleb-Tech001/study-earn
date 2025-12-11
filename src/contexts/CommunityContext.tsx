import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
  userVote?: 'up' | 'down' | null;
}

interface CommunityContextType {
  questions: Question[];
  loading: boolean;
  addQuestion: (question: Omit<Question, 'id' | 'timestamp' | 'time' | 'likes' | 'dislikes' | 'replies' | 'isBestAnswer' | 'userVote'>) => Promise<void>;
  voteQuestion: (id: string, type: 'up' | 'down') => Promise<void>;
  refreshQuestions: () => Promise<void>;
}

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch questions from database
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('community_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (questionsError) throw questionsError;

      // Fetch user's votes if logged in
      let userVotes: Record<string, 'up' | 'down'> = {};
      if (user?.id) {
        const { data: votesData } = await supabase
          .from('community_votes')
          .select('question_id, vote_type')
          .eq('user_id', user.id);
        
        if (votesData) {
          userVotes = votesData.reduce((acc, vote) => {
            acc[vote.question_id] = vote.vote_type as 'up' | 'down';
            return acc;
          }, {} as Record<string, 'up' | 'down'>);
        }
      }

      // Transform to Question format
      const formattedQuestions: Question[] = (questionsData || []).map(q => ({
        id: q.id,
        author: q.author_name,
        avatar: q.author_avatar || '',
        title: q.title,
        content: q.content,
        category: q.category,
        likes: q.likes,
        dislikes: q.dislikes,
        replies: q.replies,
        timestamp: new Date(q.created_at),
        time: formatTimeAgo(new Date(q.created_at)),
        isBestAnswer: q.is_best_answer,
        isCurrentUser: user?.id === q.user_id,
        userVote: userVotes[q.id] || null,
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load questions on mount and when user changes
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const addQuestion = async (
    question: Omit<Question, 'id' | 'timestamp' | 'time' | 'likes' | 'dislikes' | 'replies' | 'isBestAnswer' | 'userVote'>
  ) => {
    if (!user?.id) {
      toast({
        title: 'Login Required',
        description: 'Please log in to post a question.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('community_questions')
        .insert({
          user_id: user.id,
          author_name: question.author,
          author_avatar: question.avatar,
          title: question.title,
          content: question.content,
          category: question.category,
        });

      if (error) throw error;

      toast({
        title: 'Question Posted',
        description: 'Your question has been shared with the community.',
      });

      // Refresh questions list
      await fetchQuestions();
    } catch (error: any) {
      console.error('Error adding question:', error);
      toast({
        title: 'Failed to Post',
        description: error.message || 'Could not post your question. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const voteQuestion = async (id: string, type: 'up' | 'down') => {
    if (!user?.id) {
      toast({
        title: 'Login Required',
        description: 'Please log in to vote.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('community_votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('question_id', id)
        .maybeSingle();

      // Get current question counts
      const { data: question } = await supabase
        .from('community_questions')
        .select('likes, dislikes')
        .eq('id', id)
        .single();

      if (!question) return;

      let newLikes = question.likes;
      let newDislikes = question.dislikes;

      if (existingVote) {
        if (existingVote.vote_type === type) {
          // Remove vote (toggle off)
          await supabase
            .from('community_votes')
            .delete()
            .eq('id', existingVote.id);

          if (type === 'up') {
            newLikes = Math.max(0, question.likes - 1);
          } else {
            newDislikes = Math.max(0, question.dislikes - 1);
          }
        } else {
          // Change vote
          await supabase
            .from('community_votes')
            .update({ vote_type: type })
            .eq('id', existingVote.id);

          if (type === 'up') {
            newLikes = question.likes + 1;
            newDislikes = Math.max(0, question.dislikes - 1);
          } else {
            newLikes = Math.max(0, question.likes - 1);
            newDislikes = question.dislikes + 1;
          }
        }
      } else {
        // New vote
        await supabase
          .from('community_votes')
          .insert({
            user_id: user.id,
            question_id: id,
            vote_type: type,
          });

        if (type === 'up') {
          newLikes = question.likes + 1;
        } else {
          newDislikes = question.dislikes + 1;
        }
      }

      // Update question counts
      await supabase
        .from('community_questions')
        .update({ likes: newLikes, dislikes: newDislikes })
        .eq('id', id);

      // Refresh to show updated state
      await fetchQuestions();
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: 'Vote Failed',
        description: error.message || 'Could not record your vote. Please try again.',
        variant: 'destructive',
      });
    }
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
        loading,
        addQuestion,
        voteQuestion,
        refreshQuestions: fetchQuestions,
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
