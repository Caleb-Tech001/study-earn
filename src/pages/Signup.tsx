import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/models/types';
import { GraduationCap, BookOpen, Users, Shield, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      role: 'learner' as UserRole,
      icon: BookOpen,
      title: 'Learner',
      description: 'Learn new skills and earn rewards for your progress',
    },
    {
      role: 'instructor' as UserRole,
      icon: GraduationCap,
      title: 'Instructor',
      description: 'Create courses and help students achieve their goals',
    },
    {
      role: 'institution' as UserRole,
      icon: Users,
      title: 'Institution',
      description: 'Manage cohorts and reward policies for your organization',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast({
        title: 'Role Required',
        description: 'Please select a role to continue',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, selectedRole);
      toast({
        title: 'Welcome to StudyEarn!',
        description: 'Your account has been created successfully.',
      });
      navigate(`/${selectedRole}/dashboard`);
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout showNav={false}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-12">
        <div className="w-full max-w-6xl">
          <div className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-2xl font-bold">StudyEarn</span>
            </Link>
            <h1 className="mb-2 font-display text-4xl font-bold">Create Your Account</h1>
            <p className="text-muted-foreground">
              Join thousands of learners earning real rewards
            </p>
          </div>

          <Card className="border-2 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role Selection */}
              <div>
                <Label className="mb-4 block text-lg font-semibold">Choose Your Role</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  {roles.map((roleOption) => (
                    <button
                      key={roleOption.role}
                      type="button"
                      onClick={() => setSelectedRole(roleOption.role)}
                      className={`group rounded-xl border-2 p-6 text-left transition-smooth ${
                        selectedRole === roleOption.role
                          ? 'border-primary bg-primary/5 shadow-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <roleOption.icon
                        className={`mb-4 h-10 w-10 transition-smooth ${
                          selectedRole === roleOption.role
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-primary'
                        }`}
                      />
                      <h3 className="mb-2 font-display text-xl font-semibold">
                        {roleOption.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{roleOption.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email & Password */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full gradient-primary text-lg shadow-primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/signup" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>50,000+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Verified Instructors</span>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Signup;
