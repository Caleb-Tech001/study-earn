import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Leaderboard = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || 'Caleb Oladepo';
  const userAvatar = user?.user_metadata?.avatar_url || '';

  const globalLeaderboard = [
    { rank: 1, name: userName, points: 1850, streak: 14, avatar: userAvatar, change: 2, isCurrentUser: true },
    { rank: 2, name: 'Sarah Williams', points: 1180, streak: 21, avatar: '', change: -1 },
    { rank: 3, name: 'Alex Johnson', points: 1050, streak: 9, avatar: '', change: 1 },
    { rank: 4, name: 'Michael Chen', points: 890, streak: 7, avatar: '', change: -1 },
    { rank: 5, name: 'Emma Davis', points: 850, streak: 7, avatar: '', change: 0 },
    { rank: 6, name: 'David Brown', points: 820, streak: 15, avatar: '', change: 1 },
    { rank: 7, name: 'Lisa Anderson', points: 780, streak: 12, avatar: '', change: -2 },
  ];

  const weeklyLeaderboard = [
    { rank: 1, name: userName, points: 450, streak: 7, avatar: userAvatar, change: 3, isCurrentUser: true },
    { rank: 2, name: 'Sarah Williams', points: 240, streak: 21, avatar: '', change: -1 },
    { rank: 3, name: 'Alex Johnson', points: 220, streak: 14, avatar: '', change: 0 },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const LeaderboardTable = ({ data }: { data: typeof globalLeaderboard }) => (
    <div className="space-y-3">
      {data.map((entry) => (
        <Card
          key={entry.rank}
          className={`border-2 p-4 transition-smooth hover:shadow-md ${
            entry.isCurrentUser ? 'border-primary bg-primary/5' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex w-12 items-center justify-center">
                {getRankBadge(entry.rank)}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {entry.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className={`font-semibold ${entry.isCurrentUser ? 'text-primary' : ''}`}>
                  {entry.name}
                </p>
                <p className="text-sm text-muted-foreground">{entry.streak} day streak</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {entry.change !== 0 && (
                <Badge variant={entry.change > 0 ? 'default' : 'secondary'} className="gap-1">
                  <TrendingUp className={`h-3 w-3 ${entry.change < 0 ? 'rotate-180' : ''}`} />
                  {Math.abs(entry.change)}
                </Badge>
              )}
              <div className="text-right">
                <p className="font-display text-xl font-bold">{entry.points}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 font-display text-4xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">
            Compete with other learners and climb to the top
          </p>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="global">All Time</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
          </TabsList>
          <TabsContent value="global" className="mt-6">
            <LeaderboardTable data={globalLeaderboard} />
          </TabsContent>
          <TabsContent value="weekly" className="mt-6">
            <LeaderboardTable data={weeklyLeaderboard} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
