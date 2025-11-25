import { Link } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { GraduationCap, Sparkles, TrendingUp, Award } from 'lucide-react';

const Welcome = () => {
  return (
    <PublicLayout showNav={false}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-primary">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="mb-12 text-center">
            <h1 className="mb-3 font-display text-4xl font-bold">StudyEarn</h1>
            <p className="text-lg text-muted-foreground">
              Learn smarter, earn real rewards
            </p>
          </div>

          {/* Features */}
          <div className="mb-8 space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-card/50 p-4 backdrop-blur-sm transition-smooth hover:bg-card">
              <Sparkles className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Smart Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Master skills with personalized courses
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-card/50 p-4 backdrop-blur-sm transition-smooth hover:bg-card">
              <TrendingUp className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Real Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Earn for every milestone you achieve
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-card/50 p-4 backdrop-blur-sm transition-smooth hover:bg-card">
              <Award className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Verified Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Get recognized with verified badges
                </p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Link to="/choose-role" className="block">
              <Button 
                className="w-full gradient-primary shadow-primary text-lg" 
                size="lg"
              >
                Get Started
              </Button>
            </Link>

            <Link to="/login" className="block">
              <Button 
                variant="outline" 
                className="w-full text-lg" 
                size="lg"
              >
                Already have an account? Sign In
              </Button>
            </Link>
          </div>

          {/* Footer text */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Join 50,000+ active learners worldwide
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Welcome;