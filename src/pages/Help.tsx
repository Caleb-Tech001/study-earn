import { useState } from 'react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, MessageCircle, BookOpen, HelpCircle, Mail } from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn the basics of StudyEarn',
    },
    {
      icon: HelpCircle,
      title: 'Account & Billing',
      description: 'Manage your account settings',
    },
    {
      icon: MessageCircle,
      title: 'Courses & Learning',
      description: 'Everything about courses',
    },
  ];

  const faqs = [
    {
      question: 'How do I earn rewards on StudyEarn?',
      answer:
        'You earn rewards by completing verified learning activities including lessons, quizzes, timed study sessions, and assignments. Each activity has a specified reward amount that gets added to your wallet upon verification.',
    },
    {
      question: 'What is the verification process?',
      answer:
        'Our verification system includes optional proctored sessions, instructor reviews, and evidence-based submissions. This ensures the authenticity of your learning progress and maintains the integrity of the reward system.',
    },
    {
      question: 'How can I withdraw my earnings?',
      answer:
        'Navigate to your Wallet page and click the Withdraw button. You can transfer funds to your connected bank account or PayPal. Minimum withdrawal amounts and processing times vary by payment method.',
    },
    {
      question: 'Can I redeem points for items instead of cash?',
      answer:
        'Yes! Visit the Marketplace to browse reward items including gift cards, merchandise, and premium course access. Each item shows the required points for redemption.',
    },
    {
      question: 'What happens if I miss a day in my streak?',
      answer:
        'Your streak will reset to zero if you miss a day. However, we offer streak protection features that you can earn or purchase to safeguard your progress.',
    },
    {
      question: 'How do I become an instructor?',
      answer:
        'Sign up with an Instructor role, complete the onboarding process including CV submission and sample lesson upload, and connect your payout account. After verification, you can start creating courses.',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 font-display text-5xl font-bold">How Can We Help?</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground">Find answers organized by topic</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group cursor-pointer border-2 p-6 transition-smooth hover:border-primary hover:shadow-primary"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-display text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Quick answers to common questions about StudyEarn
              </p>
            </div>

            <Card className="border-2 p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl border-2 p-8 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-4 font-display text-3xl font-bold">Still Need Help?</h2>
            <p className="mb-6 text-muted-foreground">
              Our support team is here to assist you with any questions or concerns
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gradient-primary shadow-primary">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Live Chat
              </Button>
              <Button size="lg" variant="outline">
                <Mail className="mr-2 h-5 w-5" />
                Email Support
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Help;
