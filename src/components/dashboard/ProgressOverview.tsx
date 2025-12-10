import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  Flame, 
  Award, 
  Zap, 
  Trophy,
} from 'lucide-react';

export const ProgressOverview = () => {
  const stats = {
    points: 2450,
    streak: 7,
    badges: 12,
    xpLevel: 15,
    xpProgress: 68,
    rank: 1,
    totalLearners: 1234,
  };

  return (
    <Card className="border-2 p-6">
      <h3 className="mb-4 font-display text-xl font-bold">Your Progress</h3>
      
      <div className="space-y-4">
        {/* Points */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <Coins className="h-5 w-5 text-success" />
            </div>
            <span className="font-medium">Points</span>
          </div>
          <span className="font-display text-xl font-bold">{stats.points.toLocaleString()}</span>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-2">
              <Flame className="h-5 w-5 text-accent" />
            </div>
            <span className="font-medium">Streak</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold">{stats.streak}</span>
            <span className="text-muted-foreground">days</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium">Badges</span>
          </div>
          <span className="font-display text-xl font-bold">{stats.badges}</span>
        </div>

        {/* XP Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary/10 p-2">
                <Zap className="h-5 w-5 text-secondary" />
              </div>
              <span className="font-medium">Level {stats.xpLevel}</span>
            </div>
            <span className="text-sm text-muted-foreground">{stats.xpProgress}%</span>
          </div>
          <Progress value={stats.xpProgress} className="h-2" />
        </div>

        {/* Rank */}
        <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-accent/10 to-primary/10 p-3">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-accent" />
            <div>
              <p className="font-semibold">Current Rank</p>
              <p className="text-xs text-muted-foreground">Top {((stats.rank / stats.totalLearners) * 100).toFixed(1)}%</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg font-bold">
            #{stats.rank}
          </Badge>
        </div>
      </div>
    </Card>
  );
};
