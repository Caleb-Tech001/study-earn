import { Link } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  GraduationCap,
  Wallet,
  Trophy,
  Shield,
  BookOpen,
  Users,
  ArrowRight,
  Check,
  Star,
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Learn Anything',
      description: 'Access courses across multiple subjects with expert instructors',
    },
    {
      icon: Wallet,
      title: 'Earn Rewards',
      description: 'Get real rewards for completing verified learning activities',
    },
    {
      icon: Shield,
      title: 'Verified Learning',
      description: 'Proctored sessions and verified submissions ensure authenticity',
    },
    {
      icon: Trophy,
      title: 'Gamified Experience',
      description: 'Track streaks, climb leaderboards, and unlock badges',
    },
    {
      icon: Users,
      title: 'Study Together',
      description: 'Join study groups and connect with learners worldwide',
    },
    {
      icon: GraduationCap,
      title: 'Expert Instructors',
      description: 'Learn from verified professionals and industry experts',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content:
        "StudyEarn motivated me to stay consistent. I've earned over $500 while mastering Python!",
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Business Professional',
      content:
        'The verification system gives credibility to my learning. Great for career development.',
      rating: 5,
    },
    {
      name: 'Emma Davis',
      role: 'Lifelong Learner',
      content:
        'Love the community features! Study groups make learning so much more engaging.',
      rating: 5,
    },
  ];

  const steps = [
    { number: '1', title: 'Sign Up', description: 'Create your free account in seconds' },
    { number: '2', title: 'Choose Courses', description: 'Browse and enroll in courses you love' },
    { number: '3', title: 'Learn & Verify', description: 'Complete lessons with verification' },
    { number: '4', title: 'Earn Rewards', description: 'Get paid for your learning progress' },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Star className="h-4 w-4 fill-current" />
              Join 50,000+ active learners
            </div>
            <h1 className="mb-6 font-display text-5xl font-bold leading-tight md:text-7xl">
              Learn <span className="gradient-hero bg-clip-text text-transparent">Smarter</span>,
              Earn <span className="gradient-hero bg-clip-text text-transparent">Real</span> Rewards
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              The first learning platform that pays you for verified progress. No tricks, just real
              rewards for real learning.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-lg shadow-primary">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A comprehensive platform designed to make learning rewarding, engaging, and verifiable
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-2 p-6 transition-smooth hover:border-primary hover:shadow-primary"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Start earning rewards in four simple steps
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-2xl font-bold text-white shadow-primary">
                  {step.number}
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden w-full -translate-y-1/2 md:block">
                    <ArrowRight className="absolute left-1/2 h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl">
              Loved by Learners Worldwide
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              See what our community has to say about their experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="mb-4 text-foreground">{testimonial.content}</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-20">
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
            Ready to Start Earning?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Join thousands of learners who are already getting rewarded for their progress
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary shadow-lg hover:bg-white/90"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Landing;
