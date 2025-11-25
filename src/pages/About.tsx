import { PublicLayout } from '@/layouts/PublicLayout';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Target, Users, Lightbulb } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'Making quality education accessible and rewarding for everyone',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a supportive global community of learners',
    },
    {
      icon: CheckCircle2,
      title: 'Verified Learning',
      description: 'Ensuring authenticity through advanced verification',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Constantly improving the learning experience',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 font-display text-5xl font-bold md:text-6xl">About StudyEarn</h1>
            <p className="text-xl text-muted-foreground">
              We're revolutionizing education by rewarding learners for their dedication and
              verified progress.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 font-display text-3xl font-bold">Our Story</h2>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                StudyEarn was born from a simple observation: learning is valuable, but learners
                rarely see immediate tangible benefits. We believe that if you invest time and
                effort into developing new skills, you should be rewarded for it.
              </p>
              <p>
                Our platform combines cutting-edge verification technology with a robust rewards
                system to create a learning experience that's both motivating and trustworthy.
                Whether you're a student, professional, or lifelong learner, StudyEarn makes your
                educational journey more rewarding.
              </p>
              <p>
                Today, we serve thousands of learners across the globe, partnering with expert
                instructors and institutions to provide quality education that pays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Detailed */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold">How StudyEarn Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A transparent, step-by-step process designed for your success
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-8">
            <Card className="border-2 p-6">
              <div className="mb-2 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  1
                </div>
                <h3 className="font-display text-2xl font-semibold">Choose Your Path</h3>
              </div>
              <p className="ml-14 text-muted-foreground">
                Browse our extensive course catalog. Select courses that align with your interests,
                career goals, or personal development aspirations.
              </p>
            </Card>

            <Card className="border-2 p-6">
              <div className="mb-2 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  2
                </div>
                <h3 className="font-display text-2xl font-semibold">Learn with Verification</h3>
              </div>
              <p className="ml-14 text-muted-foreground">
                Complete lessons, take quizzes, and participate in timed study sessions. Our
                optional proctoring system ensures your work is authentic and verifiable.
              </p>
            </Card>

            <Card className="border-2 p-6">
              <div className="mb-2 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  3
                </div>
                <h3 className="font-display text-2xl font-semibold">Submit Evidence</h3>
              </div>
              <p className="ml-14 text-muted-foreground">
                Upload assignments, project files, or evidence of completion. Our instructor network
                reviews submissions to ensure quality and authenticity.
              </p>
            </Card>

            <Card className="border-2 p-6">
              <div className="mb-2 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  4
                </div>
                <h3 className="font-display text-2xl font-semibold">Earn & Redeem</h3>
              </div>
              <p className="ml-14 text-muted-foreground">
                Receive rewards directly to your wallet after verification. Redeem points for gift
                cards, merchandise, or withdraw as real money through supported payout methods.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold">Our Values</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="border-2 p-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default About;
