import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCommunity } from '@/contexts/CommunityContext';
import { generateLeaderboardData } from '@/utils/leaderboardData';
import { QuestionReplies } from '@/components/community/QuestionReplies';
import { opportunities, getOpportunityCounts, type Opportunity } from '@/utils/opportunitiesData';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Reply, 
  Users, 
  TrendingUp,
  Trophy,
  Medal,
  Crown,
  Target,
  CheckCircle,
  Star,
  Flame,
  ArrowUp,
  ArrowDown,
  Minus,
  GraduationCap,
  Briefcase,
  Code,
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign,
  Globe,
  Filter,
} from 'lucide-react';

const categories = ['General', 'Python', 'JavaScript', 'Web Development', 'Data Structures', 'Data Science', 'Machine Learning', 'Mobile Dev'];

interface SelectedQuestion {
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

const Community = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { questions, loading, addQuestion, voteQuestion, refreshQuestions } = useCommunity();
  const [activeTab, setActiveTab] = useState('discussions');
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', category: 'General' });
  const [selectedQuestion, setSelectedQuestion] = useState<SelectedQuestion | null>(null);
  const [opportunityFilter, setOpportunityFilter] = useState<'all' | 'scholarship' | 'internship' | 'hackathon'>('all');

  const userName = user?.user_metadata?.full_name || 'Caleb Oladepo';
  const userAvatar = user?.user_metadata?.avatar_url || '';

  const globalLeaderboard = useMemo(() => 
    generateLeaderboardData(userName, userAvatar, 100, false), 
    [userName, userAvatar]
  );
  
  const weeklyLeaderboard = useMemo(() => 
    generateLeaderboardData(userName, userAvatar, 100, true), 
    [userName, userAvatar]
  );

  const missions = [
    {
      id: '1',
      title: 'Build a Mini Calculator',
      description: 'Create a simple calculator using JavaScript',
      reward: 50,
      deadline: '3 days left',
      participants: 145,
      difficulty: 'Easy',
      completed: false,
    },
    {
      id: '2',
      title: 'Write a Tech Poem',
      description: 'Express your love for technology through poetry',
      reward: 30,
      deadline: '5 days left',
      participants: 89,
      difficulty: 'Easy',
      completed: true,
    },
    {
      id: '3',
      title: 'Design a Poster',
      description: 'Create a poster promoting digital literacy',
      reward: 75,
      deadline: '1 week left',
      participants: 67,
      difficulty: 'Medium',
      completed: false,
    },
    {
      id: '4',
      title: 'Solve 5 Algorithm Riddles',
      description: 'Complete 5 algorithm challenges',
      reward: 100,
      deadline: '2 days left',
      participants: 234,
      difficulty: 'Hard',
      completed: false,
    },
  ];

  const opportunityCounts = getOpportunityCounts();
  
  const filteredOpportunities = useMemo(() => {
    const now = new Date();
    let filtered = opportunities.filter(opp => opp.deadlineDate >= now);
    if (opportunityFilter !== 'all') {
      filtered = filtered.filter(opp => opp.type === opportunityFilter);
    }
    return filtered.sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());
  }, [opportunityFilter]);

  const trendingTopics = [
    { name: 'Python', posts: 124 },
    { name: 'Web Development', posts: 98 },
    { name: 'Data Science', posts: 76 },
    { name: 'Machine Learning', posts: 54 },
  ];

  const handleVote = async (type: 'up' | 'down', id: string) => {
    await voteQuestion(id, type);
  };

  const handleCompleteMission = (mission: typeof missions[0]) => {
    if (mission.completed) return;
    
    toast({
      title: 'Mission Started!',
      description: `You've joined "${mission.title}". Complete it to earn ${mission.reward} points!`,
    });
  };

  const handlePostQuestion = () => {
    if (!newQuestion.title || !newQuestion.content) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both title and content',
        variant: 'destructive',
      });
      return;
    }

    addQuestion({
      author: userName,
      avatar: userAvatar,
      title: newQuestion.title,
      content: newQuestion.content,
      category: newQuestion.category,
    });

    toast({
      title: 'Question Posted! 🎉',
      description: 'Your question has been submitted to the community',
    });
    setNewQuestion({ title: '', content: '', category: 'General' });
    setShowNewQuestion(false);
  };

  const handleQuestionClick = (question: typeof questions[0]) => {
    setSelectedQuestion({
      id: question.id,
      title: question.title,
      content: question.content,
      author_name: question.author,
      author_avatar: question.avatar || null,
      category: question.category,
      likes: question.likes,
      dislikes: question.dislikes,
      replies: question.replies,
      created_at: question.timestamp.toISOString(),
      user_id: question.isCurrentUser ? (user?.id || '') : '',
    });
  };

  const handleBackFromReplies = async () => {
    setSelectedQuestion(null);
    await refreshQuestions();
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3 text-success" />;
    if (change < 0) return <ArrowDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'scholarship': return <GraduationCap className="h-5 w-5" />;
      case 'internship': return <Briefcase className="h-5 w-5" />;
      case 'hackathon': return <Code className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'bg-success/10 text-success';
      case 'internship': return 'bg-primary/10 text-primary';
      case 'hackathon': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Filter questions for different tabs
  const recentQuestions = [...questions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const popularQuestions = [...questions].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
  const unansweredQuestions = questions.filter(q => q.replies === 0);

  const LeaderboardTable = ({ data }: { data: typeof globalLeaderboard }) => (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {data.map((entry) => (
        <div
          key={entry.rank}
          className={`flex items-center justify-between rounded-lg p-3 transition-smooth ${
            entry.isCurrentUser 
              ? 'bg-primary/10 border-2 border-primary' 
              : 'hover:bg-muted/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center">
              {getRankBadge(entry.rank)}
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={entry.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {entry.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={`text-sm font-medium ${entry.isCurrentUser ? 'text-primary font-bold' : ''}`}>
                {entry.name} {entry.isCurrentUser && '(You)'}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Flame className="h-3 w-3" />
                <span>{entry.streak} day streak</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {getChangeIcon(entry.change)}
              <span className="text-xs">{Math.abs(entry.change)}</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{entry.points.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const QuestionCard = ({ discussion }: { discussion: typeof questions[0] }) => (
    <Card className={`border-2 p-6 transition-smooth hover:shadow-lg ${discussion.isCurrentUser ? 'border-primary/50 bg-primary/5' : ''}`}>
      <div className="flex gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8",
              discussion.userVote === 'up' && "text-primary bg-primary/10"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleVote('up', discussion.id);
            }}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <span className="font-bold text-primary">{discussion.likes - discussion.dislikes}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8",
              discussion.userVote === 'down' && "text-destructive bg-destructive/10"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleVote('down', discussion.id);
            }}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={discussion.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {discussion.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{discussion.author}</span>
            {discussion.isCurrentUser && (
              <Badge variant="outline" className="text-xs">You</Badge>
            )}
            <span className="text-sm text-muted-foreground">• {discussion.time}</span>
            <Badge variant="secondary">{discussion.category}</Badge>
            {discussion.isBestAnswer && (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle className="mr-1 h-3 w-3" />
                Answered
              </Badge>
            )}
          </div>
          <h3 
            className="mb-2 font-display text-lg font-bold hover:text-primary cursor-pointer"
            onClick={() => handleQuestionClick(discussion)}
          >
            {discussion.title}
          </h3>
          <p className="text-sm text-muted-foreground">{discussion.content}</p>
          <div className="mt-3 flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleQuestionClick(discussion)}
            >
              <Reply className="mr-2 h-4 w-4" />
              {discussion.replies} Answers
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuestionClick(discussion)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Answer
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  // If a question is selected, show the replies view
  if (selectedQuestion) {
    return (
      <DashboardLayout>
        <QuestionReplies 
          question={selectedQuestion} 
          onBack={handleBackFromReplies} 
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-display text-4xl font-bold">Community</h1>
            <p className="text-muted-foreground">
              Connect with fellow learners, compete, and discover opportunities
            </p>
          </div>
          <Button onClick={() => setShowNewQuestion(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask Question
          </Button>
        </div>

        {/* New Question Modal */}
        {showNewQuestion && (
          <Card className="border-2 p-6 animate-fade-in">
            <h3 className="mb-4 font-display text-xl font-bold">Ask a Question</h3>
            <div className="space-y-4">
              <div>
                <Input 
                  placeholder="Question title..." 
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Textarea 
                  placeholder="Describe your question in detail..." 
                  rows={4}
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div>
                <Select
                  value={newQuestion.category}
                  onValueChange={(value) => setNewQuestion(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePostQuestion}>Post Question</Button>
                <Button variant="outline" onClick={() => setShowNewQuestion(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="discussions">Q&A Hub</TabsTrigger>
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          {/* Q&A Hub Tab */}
          <TabsContent value="discussions" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <Tabs defaultValue="recent" className="w-full">
                  <TabsList>
                    <TabsTrigger value="recent">Recent ({recentQuestions.length})</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    <TabsTrigger value="unanswered">Unanswered ({unansweredQuestions.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recent" className="mt-4 space-y-4">
                    {loading ? (
                      <Card className="border-2 p-8 text-center">
                        <p className="text-muted-foreground">Loading questions...</p>
                      </Card>
                    ) : recentQuestions.length === 0 ? (
                      <Card className="border-2 p-8 text-center">
                        <p className="text-muted-foreground">No questions yet. Be the first to ask!</p>
                      </Card>
                    ) : (
                      recentQuestions.map((discussion) => (
                        <QuestionCard key={discussion.id} discussion={discussion} />
                      ))
                    )}
                  </TabsContent>
                  <TabsContent value="popular" className="mt-4 space-y-4">
                    {popularQuestions.length === 0 ? (
                      <Card className="border-2 p-8 text-center">
                        <p className="text-muted-foreground">No popular questions yet</p>
                      </Card>
                    ) : (
                      popularQuestions.map((discussion) => (
                        <QuestionCard key={discussion.id} discussion={discussion} />
                      ))
                    )}
                  </TabsContent>
                  <TabsContent value="unanswered" className="mt-4 space-y-4">
                    {unansweredQuestions.length === 0 ? (
                      <Card className="border-2 p-8 text-center">
                        <p className="text-muted-foreground">All questions have been answered!</p>
                      </Card>
                    ) : (
                      unansweredQuestions.map((discussion) => (
                        <QuestionCard key={discussion.id} discussion={discussion} />
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <Card className="border-2 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-xl font-bold">Trending Topics</h3>
                  </div>
                  <div className="space-y-3">
                    {trendingTopics.map((topic) => (
                      <div
                        key={topic.name}
                        className="flex items-center justify-between rounded-lg border border-border p-3 transition-smooth hover:bg-muted cursor-pointer"
                      >
                        <span className="font-medium">{topic.name}</span>
                        <Badge variant="secondary">{topic.posts} posts</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="border-2 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-xl font-bold">Community Stats</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold">1,234</p>
                      <p className="text-sm text-muted-foreground">Active Members</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{questions.length}</p>
                      <p className="text-sm text-muted-foreground">Discussions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2,890</p>
                      <p className="text-sm text-muted-foreground">Replies</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {missions.map((mission) => (
                <Card 
                  key={mission.id} 
                  className={`border-2 p-6 transition-smooth hover:shadow-lg ${
                    mission.completed ? 'bg-success/5 border-success/30' : ''
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-3 ${
                        mission.completed ? 'bg-success/10' : 'bg-primary/10'
                      }`}>
                        <Target className={`h-6 w-6 ${
                          mission.completed ? 'text-success' : 'text-primary'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">{mission.title}</h3>
                        <p className="text-sm text-muted-foreground">{mission.description}</p>
                      </div>
                    </div>
                    {mission.completed && (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{mission.deadline}</span>
                    <span>•</span>
                    <span>{mission.participants} participants</span>
                    <Badge variant={
                      mission.difficulty === 'Easy' ? 'secondary' :
                      mission.difficulty === 'Medium' ? 'default' : 'destructive'
                    }>
                      {mission.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-accent" />
                      <span className="font-bold">{mission.reward} points</span>
                    </div>
                    <Button 
                      variant={mission.completed ? 'secondary' : 'default'}
                      onClick={() => handleCompleteMission(mission)}
                      disabled={mission.completed}
                    >
                      {mission.completed ? 'Completed' : 'Join Mission'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="mt-6">
            <Card className="border-2 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-accent" />
                  <h3 className="font-display text-2xl font-bold">Global Rankings</h3>
                </div>
              </div>

              <Tabs defaultValue="all-time" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all-time">All Time</TabsTrigger>
                  <TabsTrigger value="this-week">This Week</TabsTrigger>
                  <TabsTrigger value="this-month">This Month</TabsTrigger>
                </TabsList>
                <TabsContent value="all-time">
                  <LeaderboardTable data={globalLeaderboard} />
                </TabsContent>
                <TabsContent value="this-week">
                  <LeaderboardTable data={weeklyLeaderboard} />
                </TabsContent>
                <TabsContent value="this-month">
                  <LeaderboardTable data={globalLeaderboard.slice(0, 50)} />
                </TabsContent>
              </Tabs>
            </Card>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="mt-6">
            <div className="space-y-6">
              {/* Filter Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <Button 
                  variant={opportunityFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setOpportunityFilter('all')}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  All ({opportunityCounts.all})
                </Button>
                <Button 
                  variant={opportunityFilter === 'scholarship' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setOpportunityFilter('scholarship')}
                  className="gap-2"
                >
                  <GraduationCap className="h-4 w-4" />
                  Scholarships ({opportunityCounts.scholarships})
                </Button>
                <Button 
                  variant={opportunityFilter === 'internship' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setOpportunityFilter('internship')}
                  className="gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Internships ({opportunityCounts.internships})
                </Button>
                <Button 
                  variant={opportunityFilter === 'hackathon' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setOpportunityFilter('hackathon')}
                  className="gap-2"
                >
                  <Code className="h-4 w-4" />
                  Hackathons ({opportunityCounts.hackathons})
                </Button>
              </div>

              {/* Results count */}
              <p className="text-sm text-muted-foreground">
                Showing {filteredOpportunities.length} {opportunityFilter === 'all' ? 'opportunities' : opportunityFilter + 's'} with upcoming deadlines
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredOpportunities.map((opp) => (
                  <Card key={opp.id} className="border-2 p-6 transition-smooth hover:shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`rounded-xl p-3 ${getOpportunityColor(opp.type)}`}>
                        {getOpportunityIcon(opp.type)}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary" className="capitalize">
                          {opp.type}
                        </Badge>
                        {opp.isRemote && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Globe className="h-3 w-3" />
                            Remote
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-display text-lg font-bold mb-2 line-clamp-2">{opp.title}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{opp.organization}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{opp.description}</p>
                    
                    {opp.tags && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {opp.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Deadline: {opp.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{opp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-success font-medium">
                        <DollarSign className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{opp.reward}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full gap-2" asChild>
                      <a href={opp.link} target="_blank" rel="noopener noreferrer">
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </Card>
                ))}
              </div>

              {filteredOpportunities.length === 0 && (
                <Card className="border-2 p-8 text-center">
                  <p className="text-muted-foreground">
                    No {opportunityFilter === 'all' ? 'opportunities' : opportunityFilter + 's'} with upcoming deadlines found.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Community;
