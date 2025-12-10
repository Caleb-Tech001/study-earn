import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { generateLeaderboardData } from '@/utils/leaderboardData';
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
} from 'lucide-react';

const Community = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discussions');
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', category: 'General' });

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

  const discussions = [
    {
      id: '1',
      author: 'Sarah Williams',
      avatar: '',
      title: 'Tips for mastering Python decorators?',
      content: 'I\'m struggling with understanding decorators in Python. Any resources or explanations that helped you?',
      category: 'Python',
      likes: 24,
      dislikes: 2,
      replies: 8,
      time: '2 hours ago',
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
      isBestAnswer: false,
    },
  ];

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

  const trendingTopics = [
    { name: 'Python', posts: 124 },
    { name: 'Web Development', posts: 98 },
    { name: 'Data Science', posts: 76 },
    { name: 'Machine Learning', posts: 54 },
  ];

  const handleVote = (type: 'up' | 'down', id: string) => {
    toast({
      title: type === 'up' ? 'Upvoted!' : 'Downvoted',
      description: 'Your vote has been recorded',
    });
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

    toast({
      title: 'Question Posted!',
      description: 'Your question has been submitted to the community',
    });
    setNewQuestion({ title: '', content: '', category: 'General' });
    setShowNewQuestion(false);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-display text-4xl font-bold">Community</h1>
            <p className="text-muted-foreground">
              Connect with fellow learners, compete, and complete missions
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
          </TabsList>

          {/* Q&A Hub Tab */}
          <TabsContent value="discussions" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <Tabs defaultValue="recent" className="w-full">
                  <TabsList>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recent" className="mt-4 space-y-4">
                    {discussions.map((discussion) => (
                      <Card key={discussion.id} className="border-2 p-6 transition-smooth hover:shadow-lg">
                        <div className="flex gap-4">
                          {/* Vote Section */}
                          <div className="flex flex-col items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleVote('up', discussion.id)}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <span className="font-bold text-primary">{discussion.likes - discussion.dislikes}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleVote('down', discussion.id)}
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Content Section */}
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={discussion.avatar} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {discussion.author.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{discussion.author}</span>
                              <span className="text-sm text-muted-foreground">• {discussion.time}</span>
                              <Badge variant="secondary">{discussion.category}</Badge>
                              {discussion.isBestAnswer && (
                                <Badge className="bg-success text-success-foreground">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Answered
                                </Badge>
                              )}
                            </div>
                            <h3 className="mb-2 font-display text-lg font-bold hover:text-primary cursor-pointer">
                              {discussion.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{discussion.content}</p>
                            <div className="mt-3 flex items-center gap-4">
                              <Button variant="ghost" size="sm">
                                <Reply className="mr-2 h-4 w-4" />
                                {discussion.replies} Answers
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>
                  <TabsContent value="popular">
                    <Card className="border-2 p-8 text-center">
                      <p className="text-muted-foreground">Popular discussions coming soon</p>
                    </Card>
                  </TabsContent>
                  <TabsContent value="unanswered">
                    <Card className="border-2 p-8 text-center">
                      <p className="text-muted-foreground">Unanswered questions coming soon</p>
                    </Card>
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
                      <p className="text-2xl font-bold">456</p>
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
                      <span className="font-bold text-accent">+{mission.reward} pts</span>
                    </div>
                    <Button 
                      onClick={() => handleCompleteMission(mission)}
                      disabled={mission.completed}
                      variant={mission.completed ? 'outline' : 'default'}
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
                  <h2 className="font-display text-2xl font-bold">Rankings</h2>
                </div>
              </div>

              <Tabs defaultValue="alltime" className="w-full">
                <TabsList>
                  <TabsTrigger value="alltime">All Time</TabsTrigger>
                  <TabsTrigger value="weekly">This Week</TabsTrigger>
                  <TabsTrigger value="monthly">This Month</TabsTrigger>
                </TabsList>
                <TabsContent value="alltime" className="mt-4">
                  <LeaderboardTable data={globalLeaderboard} />
                </TabsContent>
                <TabsContent value="weekly" className="mt-4">
                  <LeaderboardTable data={weeklyLeaderboard} />
                </TabsContent>
                <TabsContent value="monthly" className="mt-4">
                  <LeaderboardTable data={globalLeaderboard.slice(0, 50)} />
                </TabsContent>
              </Tabs>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Community;