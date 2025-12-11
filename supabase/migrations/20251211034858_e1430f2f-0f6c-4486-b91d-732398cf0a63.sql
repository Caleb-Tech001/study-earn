-- Create a table for community question replies
CREATE TABLE public.community_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.community_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  dislikes INTEGER NOT NULL DEFAULT 0,
  is_best_answer BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view replies" 
ON public.community_replies 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create replies" 
ON public.community_replies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" 
ON public.community_replies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies" 
ON public.community_replies 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create votes table for replies
CREATE TABLE public.reply_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reply_id UUID NOT NULL REFERENCES public.community_replies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reply_id, user_id)
);

-- Enable RLS for reply votes
ALTER TABLE public.reply_votes ENABLE ROW LEVEL SECURITY;

-- Policies for reply votes
CREATE POLICY "Anyone can view reply votes" 
ON public.reply_votes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can vote on replies" 
ON public.reply_votes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change their reply vote" 
ON public.reply_votes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their reply vote" 
ON public.reply_votes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at on replies
CREATE TRIGGER update_community_replies_updated_at
BEFORE UPDATE ON public.community_replies
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_community_replies_question_id ON public.community_replies(question_id);
CREATE INDEX idx_reply_votes_reply_id ON public.reply_votes(reply_id);