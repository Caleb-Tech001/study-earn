import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorDashboard = () => {
  const stats = {
    totalStudents: 234,
    activeCourses: 5,
    monthlyEarnings: 1250.5,
    pendingReviews: 12,
  };

  const courses = [
    {
      id: '1',
      title: 'Advanced Python Programming',
      students: 89,
      completionRate: 72,
      earnings: 445.0,
      status: 'published',
    },
    {
      id: '2',
      title: 'Web Development Fundamentals',
      students: 124,
      completionRate: 68,
      earnings: 620.0,
      status: 'published',
    },
    {
      id: '3',
      title: 'Machine Learning Basics',
      students: 21,
      completionRate: 15,
      earnings: 105.5,
      status: 'draft',
    },
  ];

  const pendingSubmissions = [
    {
      id: '1',
      studentName: 'Sarah Johnson',
      courseName: 'Python Programming',
      submittedAt: '2 hours ago',
      type: 'Assignment',
    },
    {
      id: '2',
      studentName: 'Michael Chen',
      courseName: 'Web Development',
      submittedAt: '5 hours ago',
      type: 'Quiz',
    },
    {
      id: '3',
      studentName: 'Emma Davis',
      courseName: 'Machine Learning',
      submittedAt: '1 day ago',
      type: 'Project',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 font-display text-4xl font-bold">Instructor Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your courses and help students succeed
            </p>
          </div>
          <Link to="/instructor/course-builder/new">
            <Button className="gradient-primary shadow-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="mt-2 font-display text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-sm text-success">+12% from last month</p>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Courses</p>
                <p className="mt-2 font-display text-3xl font-bold">{stats.activeCourses}</p>
              </div>
              <div className="rounded-xl bg-secondary/10 p-3">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <Link to="/instructor/courses">
              <Button variant="link" className="mt-4 h-auto p-0">
                Manage Courses
              </Button>
            </Link>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                <p className="mt-2 font-display text-3xl font-bold">
                  ${stats.monthlyEarnings.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl bg-success/10 p-3">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
            <Link to="/instructor/payout">
              <Button variant="link" className="mt-4 h-auto p-0">
                View Payout
              </Button>
            </Link>
          </Card>

          <Card className="border-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="mt-2 font-display text-3xl font-bold">{stats.pendingReviews}</p>
              </div>
              <div className="rounded-xl bg-accent/10 p-3">
                <Clock className="h-6 w-6 text-accent" />
              </div>
            </div>
            <Link to="/instructor/reviews">
              <Button variant="link" className="mt-4 h-auto p-0">
                Review Now
              </Button>
            </Link>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* My Courses */}
          <Card className="border-2 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">My Courses</h2>
              <Link to="/instructor/courses">
                <Button variant="ghost">View All</Button>
              </Link>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="font-semibold">{course.title}</h3>
                        <Badge
                          variant={course.status === 'published' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {course.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students} students
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {course.completionRate}% completion
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Earned</p>
                      <p className="font-display text-xl font-bold text-success">
                        ${course.earnings.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Link to={`/instructor/course-builder/${course.id}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      Edit Course
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </Card>

          {/* Pending Reviews */}
          <Card className="border-2 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Pending Reviews</h2>
              <Badge variant="secondary">{pendingSubmissions.length}</Badge>
            </div>

            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <Card key={submission.id} className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-medium">{submission.studentName}</p>
                      <p className="text-sm text-muted-foreground">{submission.courseName}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {submission.type}
                    </Badge>
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">{submission.submittedAt}</p>
                  <Button size="sm" className="w-full">
                    Review
                  </Button>
                </Card>
              ))}
            </div>

            <Link to="/instructor/reviews">
              <Button variant="outline" className="mt-4 w-full">
                View All Submissions
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
