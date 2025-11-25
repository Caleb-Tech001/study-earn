import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  Shield,
  BookOpen,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = {
    totalUsers: 52340,
    totalInstructors: 1250,
    totalInstitutions: 145,
    pendingWithdrawals: 45,
    monthlyRevenue: 125000,
    activeReports: 8,
  };

  const recentActivity = [
    {
      type: 'user',
      message: '234 new user registrations',
      time: 'Last 24 hours',
      icon: Users,
      color: 'text-primary',
    },
    {
      type: 'withdrawal',
      message: '45 withdrawal requests pending',
      time: 'Requires attention',
      icon: DollarSign,
      color: 'text-accent',
    },
    {
      type: 'report',
      message: '8 reports flagged for review',
      time: 'High priority',
      icon: AlertTriangle,
      color: 'text-destructive',
    },
    {
      type: 'course',
      message: '12 new courses published',
      time: 'Last week',
      icon: BookOpen,
      color: 'text-success',
    },
  ];

  const systemHealth = [
    { name: 'API Response Time', value: 245, unit: 'ms', status: 'good' },
    { name: 'Database Load', value: 45, unit: '%', status: 'good' },
    { name: 'Active Sessions', value: 3420, unit: '', status: 'good' },
    { name: 'Error Rate', value: 0.2, unit: '%', status: 'good' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2 font-display text-4xl font-bold">Admin Console</h1>
          <p className="text-muted-foreground">
            Monitor platform health and manage global settings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="mt-2 font-display text-3xl font-bold">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-sm text-success">+8.2% this month</p>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Instructors</p>
                <p className="mt-2 font-display text-3xl font-bold">
                  {stats.totalInstructors.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-secondary/10 p-3">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <Link to="/admin/users">
              <Button variant="link" className="mt-4 h-auto p-0">
                Manage Users
              </Button>
            </Link>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Institutions</p>
                <p className="mt-2 font-display text-3xl font-bold">{stats.totalInstitutions}</p>
              </div>
              <div className="rounded-xl bg-accent/10 p-3">
                <Shield className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Withdrawals</p>
                <p className="mt-2 font-display text-3xl font-bold">{stats.pendingWithdrawals}</p>
              </div>
              <div className="rounded-xl bg-warning/10 p-3">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
            </div>
            <Link to="/admin/finance">
              <Button variant="link" className="mt-4 h-auto p-0 text-warning">
                Review Now
              </Button>
            </Link>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="border-2 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Recent Activity</h2>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg bg-muted p-3 ${activity.color}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* System Health */}
          <Card className="border-2 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">System Health</h2>
              <div className="h-2 w-2 animate-pulse rounded-full bg-success"></div>
            </div>

            <div className="space-y-4">
              {systemHealth.map((metric, index) => (
                <div key={index}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{metric.name}</span>
                    <span className="font-semibold">
                      {metric.value}
                      {metric.unit}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-success transition-all"
                      style={{
                        width: metric.status === 'good' ? '100%' : '60%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-6 w-full">
              View Full Metrics
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-2 p-6">
          <h2 className="mb-6 font-display text-2xl font-bold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Link to="/admin/users">
              <Button variant="outline" className="h-auto flex-col gap-2 p-6">
                <Users className="h-8 w-8" />
                <span>Manage Users</span>
              </Button>
            </Link>
            <Link to="/admin/finance">
              <Button variant="outline" className="h-auto flex-col gap-2 p-6">
                <DollarSign className="h-8 w-8" />
                <span>Finance</span>
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline" className="h-auto flex-col gap-2 p-6">
                <TrendingUp className="h-8 w-8" />
                <span>Analytics</span>
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="outline" className="h-auto flex-col gap-2 p-6">
                <Shield className="h-8 w-8" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
