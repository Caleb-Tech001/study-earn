import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, BookOpen, Clock, Trophy, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Modules = () => {
  const modules = [
    {
      id: '1',
      title: 'Advanced Python Programming',
      instructor: 'Dr. Sarah Johnson',
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      estimatedTime: '8 hours',
      totalReward: 150,
      status: 'in_progress',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    },
    {
      id: '2',
      title: 'Web Development Fundamentals',
      instructor: 'Michael Chen',
      progress: 30,
      totalLessons: 30,
      completedLessons: 9,
      estimatedTime: '12 hours',
      totalReward: 180,
      status: 'in_progress',
      thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400',
    },
    {
      id: '3',
      title: 'Data Science Basics',
      instructor: 'Prof. Emma Davis',
      progress: 15,
      totalLessons: 20,
      completedLessons: 3,
      estimatedTime: '10 hours',
      totalReward: 200,
      status: 'in_progress',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    },
    {
      id: '4',
      title: 'Introduction to Machine Learning',
      instructor: 'Alex Thompson',
      progress: 0,
      totalLessons: 25,
      completedLessons: 0,
      estimatedTime: '15 hours',
      totalReward: 250,
      status: 'not_started',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 font-display text-4xl font-bold">My Learning Modules</h1>
            <p className="text-muted-foreground">
              Continue your journey and earn rewards for every completed lesson
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="border-2 p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search modules..." className="pl-10" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Modules</p>
                <p className="font-display text-2xl font-bold">{modules.length}</p>
              </div>
            </div>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-accent/10 p-3">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="font-display text-2xl font-bold">45 hrs</p>
              </div>
            </div>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-secondary/10 p-3">
                <Trophy className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rewards</p>
                <p className="font-display text-2xl font-bold">$780</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((module) => (
            <Card key={module.id} className="overflow-hidden border-2 transition-smooth hover:shadow-lg">
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={module.thumbnail}
                  alt={module.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-4 top-4">
                  {module.status === 'in_progress' ? (
                    <Badge className="bg-secondary">In Progress</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-card">
                      Not Started
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-2 font-display text-xl font-bold">{module.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">by {module.instructor}</p>

                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {module.completedLessons}/{module.totalLessons} lessons
                    </span>
                  </div>
                  <Progress value={module.progress} />
                </div>

                <div className="mb-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{module.estimatedTime} left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-secondary">+${module.totalReward}</span>
                  </div>
                </div>

                <Link to={`/learner/module/${module.id}`}>
                  <Button className="w-full">
                    {module.status === 'in_progress' ? 'Continue Learning' : 'Start Module'}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Modules;
