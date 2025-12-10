import { useState } from 'react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, MessageCircle, BookOpen, HelpCircle, Mail, Send, Copy, CheckCircle, Ticket, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Ticket lookup state
  const [ticketLookupId, setTicketLookupId] = useState('');
  const [ticketLookupResult, setTicketLookupResult] = useState<{
    ticket_id: string;
    subject: string;
    status: string;
    created_at: string;
    message: string;
  } | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const { toast } = useToast();

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
    {
      question: 'What are the minimum system requirements?',
      answer:
        'StudyEarn works on any modern web browser (Chrome, Firefox, Safari, Edge). For video lessons, we recommend a stable internet connection of at least 5 Mbps. Mobile apps are available for iOS and Android devices.',
    },
    {
      question: 'How do I reset my password?',
      answer:
        'Click on "Forgot Password" on the login page and enter your registered email address. You\'ll receive a password reset link within a few minutes. If you don\'t see it, check your spam folder.',
    },
    {
      question: 'Can I get a refund for purchased courses?',
      answer:
        'Yes, we offer a 7-day refund policy for purchased courses if you\'ve completed less than 30% of the content. Contact our support team with your order details to initiate a refund.',
    },
    {
      question: 'How do referral bonuses work?',
      answer:
        'Share your unique referral code with friends. When they sign up and complete their first course, both you and your friend receive bonus points. There\'s no limit to how many people you can refer!',
    },
    {
      question: 'Are certificates provided upon course completion?',
      answer:
        'Yes! Upon successfully completing a course and passing the final assessment, you\'ll receive a verifiable digital certificate that you can share on LinkedIn or download as a PDF.',
    },
    {
      question: 'How do I report inappropriate content or users?',
      answer:
        'Click the "Report" button available on any content or user profile. Our moderation team reviews all reports within 24 hours and takes appropriate action to maintain a safe learning environment.',
    },
    {
      question: 'Can I access courses offline?',
      answer:
        'Premium members can download course materials for offline access through our mobile app. Downloaded content remains available for 30 days before requiring an internet connection to refresh.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept all major credit/debit cards, PayPal, bank transfers, and mobile money (in supported regions). All transactions are secured with industry-standard encryption.',
    },
    {
      question: 'How do I contact my instructor?',
      answer:
        'Each course has a Q&A section where you can post questions. For direct communication, some instructors enable private messaging. You can also participate in community discussions for peer support.',
    },
  ];

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageForm.name || !messageForm.email || !messageForm.subject || !messageForm.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-support-ticket', {
        body: {
          name: messageForm.name,
          email: messageForm.email,
          subject: messageForm.subject,
          message: messageForm.message,
        },
      });

      if (error) throw error;

      setTicketId(data.ticketId);
      setTicketSubmitted(true);
      toast({
        title: 'Message Sent!',
        description: 'Your support ticket has been created and you\'ll receive a confirmation email.',
      });
    } catch (error: any) {
      console.error('Error submitting ticket:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTicketLookup = async () => {
    if (!ticketLookupId.trim()) {
      setLookupError('Please enter a ticket ID');
      return;
    }

    setIsLookingUp(true);
    setLookupError('');
    setTicketLookupResult(null);

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('ticket_id, subject, status, created_at, message')
        .eq('ticket_id', ticketLookupId.trim().toUpperCase())
        .single();

      if (error || !data) {
        setLookupError('No ticket found with this ID. Please check and try again.');
        return;
      }

      setTicketLookupResult(data);
    } catch (error) {
      setLookupError('Failed to look up ticket. Please try again.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const copyTicketId = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Ticket ID copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const resetMessageForm = () => {
    setMessageForm({ name: '', email: '', subject: '', message: '' });
    setTicketSubmitted(false);
    setTicketId('');
    setIsMessageDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

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

      {/* Ticket Lookup Section */}
      <section className="border-b py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <Card className="border-2 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                  <Ticket className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">Track Your Ticket</h3>
                  <p className="text-sm text-muted-foreground">Enter your ticket ID to check status</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Ticket ID (e.g., SE-XXXXX-XXXX)"
                  value={ticketLookupId}
                  onChange={(e) => {
                    setTicketLookupId(e.target.value);
                    setLookupError('');
                  }}
                  className="flex-1"
                />
                <Button onClick={handleTicketLookup} disabled={isLookingUp}>
                  {isLookingUp ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Look Up'
                  )}
                </Button>
              </div>
              {lookupError && (
                <p className="mt-2 text-sm text-destructive">{lookupError}</p>
              )}
              {ticketLookupResult && (
                <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <code className="font-bold text-primary">{ticketLookupResult.ticket_id}</code>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(ticketLookupResult.status)}`}>
                      {ticketLookupResult.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="font-medium mb-1">{ticketLookupResult.subject}</p>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{ticketLookupResult.message}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(ticketLookupResult.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </Card>
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
                {faqs
                  .filter(
                    (faq) =>
                      searchQuery === '' ||
                      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((faq, index) => (
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
              {/* Leave a Message Dialog */}
              <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gradient-primary shadow-primary">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Leave a Message
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  {!ticketSubmitted ? (
                    <>
                      <DialogHeader>
                        <DialogTitle className="font-display text-2xl">Leave a Message</DialogTitle>
                        <DialogDescription>
                          Fill out the form below and we'll get back to you as soon as possible. 
                          You'll receive a ticket ID to track your request.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitMessage} className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            value={messageForm.name}
                            onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={messageForm.email}
                            onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="What is this about?"
                            value={messageForm.subject}
                            onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Describe your issue or question in detail..."
                            rows={4}
                            value={messageForm.message}
                            onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                            disabled={isSubmitting}
                          />
                        </div>
                        <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit Message
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <DialogHeader>
                        <DialogTitle className="font-display text-2xl">Message Submitted!</DialogTitle>
                        <DialogDescription className="mt-2">
                          Your message has been sent to our support team and saved. You'll receive a confirmation email shortly.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-6">
                        <p className="mb-2 text-sm text-muted-foreground">Your Ticket ID:</p>
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-3">
                          <code className="text-lg font-bold text-primary">{ticketId}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyTicketId}
                            className="h-8 w-8 p-0"
                          >
                            {copied ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                          Use this ticket ID to track your request status above.
                        </p>
                      </div>
                      <Button onClick={resetMessageForm} className="mt-6 w-full" variant="outline">
                        Close
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Email Support Button */}
              <Button
                size="lg"
                variant="outline"
                asChild
              >
                <a href="mailto:studyearnservices@gmail.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Support
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Help;
