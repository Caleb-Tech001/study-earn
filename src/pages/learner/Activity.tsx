import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  CheckCircle2,
  BookOpen,
  Flame,
  Calendar,
  TrendingUp,
} from 'lucide-react';

const Activity = () => {
  const recentActivity = [
    {
      id: '1',
      type: 'achievement',
      title: 'Completed Python Basics Quiz',
      description: 'Scored 95% on the final assessment',
      icon: CheckCircle2,
      color: 'text-success',
      time: '2 hours ago',
      points: 15,
    },
    {
      id: '2',
      type: 'streak',
      title: '7-Day Learning Streak',
      description: 'Maintained consistent learning for a week',
      icon: Flame,
      color: 'text-accent',
      time: '1 day ago',
      points: 25,
    },
    {
      id: '3',
      type: 'course',
      title: 'Started Data Structures Module',
      description: 'Enrolled in advanced programming course',
      icon: BookOpen,
      color: 'text-primary',
      time: '1 day ago',
      points: 0,
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Early Bird Badge',
      description: 'Completed 5 lessons before 9 AM',
      icon: Trophy,
      color: 'text-secondary',
      time: '2 days ago',
      points: 20,
    },
  ];

  const achievements = [
    { title: 'First Steps', description: 'Complete your first module', unlocked: true },
    { title: 'Quick Learner', description: 'Complete 5 modules in a week', unlocked: true },
    { title: 'Streak Master', description: '30-day learning streak', unlocked: false },
    { title: 'Top Scorer', description: 'Score 100% on 10 quizzes', unlocked: false },
  ];

  const weeklyStats = [
    { day: 'Mon', hours: 2.5, completed: 3 },
    { day: 'Tue', hours: 3.0, completed: 4 },
    { day: 'Wed', hours: 1.5, completed: 2 },
    { day: 'Thu', hours: 4.0, completed: 5 },
    { day: 'Fri', hours: 2.0, completed: 3 },
    { day: 'Sat', hours: 3.5, completed: 4 },
    { day: 'Sun', hours: 2.5, completed: 3 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 font-display text-4xl font-bold">Activity</h1>
          <p className="text-muted-foreground">
            Track your learning progress and achievements
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
            <p className="font-display text-3xl font-bold">18.5 hours</p>
            <p className="mt-2 text-sm text-success">+15% from last week</p>
          </Card>
          <Card className="border-2 p-6">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <p className="font-display text-3xl font-bold">24 lessons</p>
            <p className="mt-2 text-sm text-muted-foreground">This week</p>
          </Card>
          <Card className="border-2 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent" />
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
            <p className="font-display text-3xl font-bold">7 days</p>
            <p className="mt-2 text-sm text-muted-foreground">Keep it up!</p>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="recent" className="w-full">
              <TabsList>
                <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                <TabsTrigger value="weekly">Weekly Stats</TabsTrigger>
              </TabsList>
              <TabsContent value="recent" className="mt-6 space-y-4">
                {recentActivity.map((activity) => (
                  <Card key={activity.id} className="border-2 p-4 transition-smooth hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-lg bg-muted p-3 ${activity.color}`}>
                        <activity.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.points > 0 && (
                        <Badge variant="secondary" className="text-success">
                          +{activity.points} pts
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="weekly" className="mt-6">
                <Card className="border-2 p-6">
                  <h3 className="mb-4 font-display text-xl font-bold">Weekly Progress</h3>
                  <div className="space-y-3">
                    {weeklyStats.map((stat) => (
                      <div key={stat.day} className="flex items-center gap-4">
                        <span className="w-12 text-sm font-medium">{stat.day}</span>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{stat.hours} hours</span>
                            <span className="text-muted-foreground">{stat.completed} completed</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${(stat.hours / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Card className="border-2 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              <h3 className="font-display text-xl font-bold">Achievements</h3>
            </div>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`rounded-lg border border-border p-4 ${
                    achievement.unlocked ? 'bg-muted/50' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Trophy
                      className={`h-5 w-5 ${
                        achievement.unlocked ? 'text-accent' : 'text-muted-foreground'
                      }`}
                    />
                    <div>
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Activity;
