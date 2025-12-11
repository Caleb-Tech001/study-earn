import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, MessageSquare, Send, ArrowLeft, Award, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Reply {
  id: string;
  question_id: string;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  content: string;
  likes: number;
  dislikes: number;
  is_best_answer: boolean;
  created_at: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_avatar: string | null;
  category: string;
  likes: number;
  dislikes: number;
  replies: number;
  created_at: string;
  user_id: string;
}

interface QuestionRepliesProps {
  question: Question;
  onBack: () => void;
}

export const QuestionReplies = ({ question, onBack }: QuestionRepliesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [userVotes, setUserVotes] = useState<Record<string, 'like' | 'dislike'>>({});
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  const fetchReplies = async () => {
    try {
      const { data, error } = await supabase
        .from('community_replies')
        .select('*')
        .eq('question_id', question.id)
        .order('is_best_answer', { ascending: false })
        .order('likes', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);

      if (user) {
        const { data: votes } = await supabase
          .from('reply_votes')
          .select('reply_id, vote_type')
          .eq('user_id', user.id);

        if (votes) {
          const votesMap: Record<string, 'like' | 'dislike'> = {};
          votes.forEach(v => { votesMap[v.reply_id] = v.vote_type as 'like' | 'dislike'; });
          setUserVotes(votesMap);
        }
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReplies(); }, [question.id, user]);

  const handleSubmitReply = async () => {
    if (!user || !replyContent.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('community_replies').insert({
        question_id: question.id,
        user_id: user.id,
        author_name: profile?.full_name || 'Anonymous',
        author_avatar: profile?.avatar_url,
        content: replyContent.trim(),
      });
      if (error) throw error;
      await supabase.from('community_questions').update({ replies: question.replies + 1 }).eq('id', question.id);
      setReplyContent('');
      fetchReplies();
      toast({ title: 'Reply posted!' });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({ title: 'Failed to post reply', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (replyId: string, voteType: 'like' | 'dislike') => {
    if (!user) { toast({ title: 'Please log in to vote', variant: 'destructive' }); return; }
    try {
      const currentVote = userVotes[replyId];
      const reply = replies.find(r => r.id === replyId);
      if (!reply) return;
      let newLikes = reply.likes, newDislikes = reply.dislikes;

      if (currentVote === voteType) {
        await supabase.from('reply_votes').delete().eq('reply_id', replyId).eq('user_id', user.id);
        if (voteType === 'like') newLikes--; else newDislikes--;
        setUserVotes(prev => { const copy = { ...prev }; delete copy[replyId]; return copy; });
      } else {
        if (currentVote) {
          await supabase.from('reply_votes').update({ vote_type: voteType }).eq('reply_id', replyId).eq('user_id', user.id);
          if (currentVote === 'like') newLikes--; else newDislikes--;
        } else {
          await supabase.from('reply_votes').insert({ reply_id: replyId, user_id: user.id, vote_type: voteType });
        }
        if (voteType === 'like') newLikes++; else newDislikes++;
        setUserVotes(prev => ({ ...prev, [replyId]: voteType }));
      }
      await supabase.from('community_replies').update({ likes: newLikes, dislikes: newDislikes }).eq('id', replyId);
      setReplies(prev => prev.map(r => r.id === replyId ? { ...r, likes: newLikes, dislikes: newDislikes } : r));
    } catch (error) { console.error('Error voting:', error); }
  };

  const handleMarkBestAnswer = async (replyId: string) => {
    if (!user || user.id !== question.user_id) return;
    try {
      await supabase.from('community_replies').update({ is_best_answer: false }).eq('question_id', question.id);
      await supabase.from('community_replies').update({ is_best_answer: true }).eq('id', replyId);
      fetchReplies();
      toast({ title: 'Best answer marked!' });
    } catch (error) { console.error('Error marking best answer:', error); }
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Questions
        </Button>
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={question.author_avatar || undefined} />
              <AvatarFallback>{question.author_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{question.title}</h2>
                <Badge variant="outline">{question.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Asked by {question.author_name} • {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
              </p>
              <p className="text-foreground">{question.content}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" /> {question.likes}</span>
                <span className="flex items-center gap-1"><ThumbsDown className="h-4 w-4" /> {question.dislikes}</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {replies.length} replies</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {user && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Your Answer</h3>
          <Textarea placeholder="Write your reply..." value={replyContent} onChange={e => setReplyContent(e.target.value)} rows={4} className="mb-3" />
          <Button onClick={handleSubmitReply} disabled={!replyContent.trim() || submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Post Reply
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="h-5 w-5" /> {replies.length} Replies</h3>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : replies.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">No replies yet. Be the first to answer!</Card>
        ) : (
          replies.map(reply => (
            <Card key={reply.id} className={cn('p-4', reply.is_best_answer && 'border-success bg-success/5')}>
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={reply.author_avatar || undefined} />
                  <AvatarFallback>{reply.author_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{reply.author_name}</span>
                    {reply.is_best_answer && <Badge className="bg-success text-success-foreground"><Award className="mr-1 h-3 w-3" /> Best Answer</Badge>}
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}</span>
                  </div>
                  <p className="text-foreground mb-3">{reply.content}</p>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => handleVote(reply.id, 'like')} className={cn(userVotes[reply.id] === 'like' && 'text-success')}>
                      <ThumbsUp className="mr-1 h-4 w-4" /> {reply.likes}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleVote(reply.id, 'dislike')} className={cn(userVotes[reply.id] === 'dislike' && 'text-destructive')}>
                      <ThumbsDown className="mr-1 h-4 w-4" /> {reply.dislikes}
                    </Button>
                    {user && user.id === question.user_id && !reply.is_best_answer && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkBestAnswer(reply.id)}><Award className="mr-1 h-4 w-4" /> Mark as Best</Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
