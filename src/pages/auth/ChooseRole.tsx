import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Users, ArrowLeft } from 'lucide-react';

const ChooseRole = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      role: 'learner',
      icon: BookOpen,
      title: 'Learner',
      description: 'Learn new skills and earn rewards for your progress',
    },
    {
      role: 'instructor',
      icon: GraduationCap,
      title: 'Instructor',
      description: 'Create courses and help students achieve their goals',
    },
    {
      role: 'institution',
      icon: Users,
      title: 'Institution',
      description: 'Manage cohorts and reward policies for your organization',
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/signup', { state: { role: selectedRole } });
    }
  };

  return (
    <PublicLayout showNav={false}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-12">
        <div className="w-full max-w-4xl animate-fade-in">
          {/* Back button */}
          <Link 
            to="/welcome" 
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-display text-4xl font-bold">Choose Your Role</h1>
            <p className="text-muted-foreground">
              Select how you want to use StudyEarn
            </p>
          </div>

          {/* Role cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {roles.map((roleOption) => (
              <button
                key={roleOption.role}
                onClick={() => setSelectedRole(roleOption.role)}
                className={`group rounded-xl border-2 p-6 text-left transition-smooth ${
                  selectedRole === roleOption.role
                    ? 'border-primary bg-primary/5 shadow-primary scale-105'
                    : 'border-border hover:border-primary/50 hover:scale-102'
                }`}
              >
                <roleOption.icon
                  className={`mb-4 h-12 w-12 transition-smooth ${
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

          {/* Continue button */}
          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedRole}
              className="gradient-primary shadow-primary min-w-48"
              size="lg"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ChooseRole;