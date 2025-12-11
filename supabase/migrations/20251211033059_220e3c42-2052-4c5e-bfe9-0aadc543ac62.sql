-- Create community_questions table
CREATE TABLE public.community_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  likes INTEGER NOT NULL DEFAULT 0,
  dislikes INTEGER NOT NULL DEFAULT 0,
  replies INTEGER NOT NULL DEFAULT 0,
  is_best_answer BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_votes table to track user votes
CREATE TABLE public.community_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES public.community_questions(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Enable RLS
ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_questions
CREATE POLICY "Anyone can view questions"
ON public.community_questions
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create questions"
ON public.community_questions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions"
ON public.community_questions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions"
ON public.community_questions
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for community_votes
CREATE POLICY "Anyone can view votes"
ON public.community_votes
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can vote"
ON public.community_votes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change their vote"
ON public.community_votes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their vote"
ON public.community_votes
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at on questions
CREATE TRIGGER update_community_questions_updated_at
BEFORE UPDATE ON public.community_questions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_community_questions_user_id ON public.community_questions(user_id);
CREATE INDEX idx_community_questions_category ON public.community_questions(category);
CREATE INDEX idx_community_questions_created_at ON public.community_questions(created_at DESC);
CREATE INDEX idx_community_votes_question_id ON public.community_votes(question_id);
CREATE INDEX idx_community_votes_user_id ON public.community_votes(user_id);