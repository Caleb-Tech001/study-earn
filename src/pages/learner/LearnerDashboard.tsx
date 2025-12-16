import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SkillToEarnTiles } from '@/components/dashboard/SkillToEarnTiles';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ProgressOverview } from '@/components/dashboard/ProgressOverview';
import { CrosswordGame } from '@/components/games/CrosswordGame';
import { useWallet } from '@/contexts/WalletContext';
import {
  Wallet,
  TrendingUp,
  BookOpen,
  Trophy,
  Clock,
  Flame,
  CheckCircle2,
  ArrowRight,
  Gamepad2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const LearnerDashboard = () => {
  const [showGame, setShowGame] = useState(false);
  const { balance } = useWallet();
  
  // Stats using real wallet balance
  const stats = {
    balance,
    streak: 7,
    completedModules: 12,
    inProgressModules: 3,
  };

  const recentActivity = [
    {
      title: 'Completed Python Basics Quiz',
      reward: 15,
      time: '2 hours ago',
      icon: CheckCircle2,
      color: 'text-success',
    },
    {
      title: 'Started Data Structures Module',
      reward: 0,
      time: '1 day ago',
      icon: BookOpen,
      color: 'text-primary',
    },
    {
      title: 'Earned Achievement: 7 Day Streak',
      reward: 25,
      time: '1 day ago',
      icon: Trophy,
      color: 'text-accent',
    },
  ];

  const inProgressModules = [
    {
      id: '1',
      title: 'Advanced Python Programming',
      progress: 65,
      nextLesson: 'Decorators and Context Managers',
      reward: 50,
    },
    {
      id: '2',
      title: 'Web Development Fundamentals',
      progress: 30,
      nextLesson: 'CSS Flexbox and Grid',
      reward: 40,
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Johnson', points: 1250 },
    { rank: 2, name: 'Sarah Williams', points: 1180 },
    { rank: 3, name: 'Michael Chen', points: 1050 },
    { rank: 4, name: 'You', points: 890, isCurrentUser: true },
    { rank: 5, name: 'Emma Davis', points: 820 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2 font-display text-4xl font-bold">Welcome Back!</h1>
          <p className="text-muted-foreground">
            Keep up the great work. You're making excellent progress!
          </p>
        </div>

        {/* Progress Overview */}
        <ProgressOverview />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="mt-1 font-display text-2xl font-bold">${stats.balance}</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-3">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
            <Link to="/learner/wallet">
              <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                View Wallet <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </Card>

          <Card className="border-2 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="mt-1 font-display text-2xl font-bold">{stats.streak} days</p>
              </div>
              <div className="rounded-xl bg-accent/10 p-3">
                <Flame className="h-5 w-5 text-accent" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Keep it up!</p>
          </Card>

          <Card className="border-2 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Modules Completed</p>
                <p className="mt-1 font-display text-2xl font-bold">{stats.completedModules}</p>
              </div>
              <div className="rounded-xl bg-success/10 p-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
            <Link to="/learner/modules">
              <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </Card>

          <Card className="border-2 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="mt-1 font-display text-2xl font-bold">{stats.inProgressModules}</p>
              </div>
              <div className="rounded-xl bg-secondary/10 p-3">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Continue learning!</p>
          </Card>
        </div>

        {/* Skill-to-Earn Tiles */}
        <SkillToEarnTiles />

        {/* Quick Actions */}
        <QuickActions onPlayGame={() => setShowGame(true)} />

        {/* Game Section */}
        {showGame && (
          <Card className="border-2 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-accent/10 p-3">
                  <Gamepad2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">Crossword Puzzle</h2>
                  <p className="text-sm text-muted-foreground">Complete the puzzle to earn points!</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowGame(false)}>
                Close Game
              </Button>
            </div>
            <CrosswordGame />
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* In Progress Modules */}
          <Card className="border-2 p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Continue Learning</h2>
              <Link to="/learner/modules">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>

            <div className="space-y-3">
              {inProgressModules.map((module) => (
                <Card key={module.id} className="p-4 transition-smooth hover:shadow-md">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">{module.nextLesson}</p>
                    </div>
                    <div className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
                      +${module.reward}
                    </div>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="mb-3" />
                  <Link to={`/learner/module/${module.id}`}>
                    <Button size="sm" className="w-full">
                      Continue
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="border-2 p-6">
              <h3 className="mb-4 font-display text-lg font-bold">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className={`rounded-lg bg-muted p-2 ${activity.color}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.reward > 0 && (
                      <div className="text-sm font-semibold text-success">
                        +${activity.reward}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Mini Leaderboard */}
            <Card className="border-2 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Leaderboard</h3>
                <Trophy className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-2">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between rounded-lg p-2 ${
                      entry.isCurrentUser ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          entry.rank === 1
                            ? 'bg-accent text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {entry.rank}
                      </div>
                      <span className={`text-sm ${entry.isCurrentUser ? 'font-semibold' : ''}`}>
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{entry.points} pts</span>
                  </div>
                ))}
              </div>
              <Link to="/learner/community">
                <Button variant="outline" className="mt-4 w-full" size="sm">
                  View Full Leaderboard
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LearnerDashboard;