import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Award, TrendingUp, BookOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstitutionDashboard = () => {
  const stats = {
    totalCohorts: 8,
    activeStudents: 456,
    totalRewardsDistributed: 12500.0,
    averageCompletion: 68,
  };

  const cohorts = [
    {
      id: '1',
      name: 'Computer Science Fall 2024',
      students: 125,
      completion: 72,
      totalRewards: 3250.0,
    },
    {
      id: '2',
      name: 'Data Science Spring 2024',
      students: 98,
      completion: 65,
      totalRewards: 2890.0,
    },
    {
      id: '3',
      name: 'Web Development Bootcamp',
      students: 156,
      completion: 58,
      totalRewards: 4560.0,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 font-display text-4xl font-bold">Institution Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your cohorts and reward policies
            </p>
          </div>
          <Link to="/institution/cohorts">
            <Button className="gradient-primary shadow-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create New Cohort
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cohorts</p>
                <p className="mt-2 font-display text-3xl font-bold">{stats.totalCohorts}</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="mt-2 font-display text-3xl font-bold">{stats.activeStudents}</p>
              </div>
              <div className="rounded-xl bg-secondary/10 p-3">
                <Users className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rewards Distributed</p>
                <p className="mt-2 font-display text-3xl font-bold">
                  ${stats.totalRewardsDistributed.toFixed(0)}
                </p>
              </div>
              <div className="rounded-xl bg-success/10 p-3">
                <Award className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Completion</p>
                <p className="mt-2 font-display text-3xl font-bold">{stats.averageCompletion}%</p>
              </div>
              <div className="rounded-xl bg-accent/10 p-3">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Cohorts Overview */}
        <Card className="border-2 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Active Cohorts</h2>
            <Link to="/institution/cohorts">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cohorts.map((cohort) => (
              <Card key={cohort.id} className="p-6">
                <h3 className="mb-4 font-display text-lg font-bold">{cohort.name}</h3>
                
                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">{cohort.students}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{cohort.completion}%</span>
                  </div>
                  <Progress value={cohort.completion} />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Rewards</span>
                    <span className="font-semibold text-success">
                      ${cohort.totalRewards.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link to={`/institution/cohorts`}>
                  <Button size="sm" variant="outline" className="w-full">
                    Manage Cohort
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstitutionDashboard;
