import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Gift, 
  Share2, 
  Copy, 
  CheckCircle,
  Trophy,
  Coins,
  Star,
  TrendingUp,
  Zap,
  Crown,
  Medal,
  ArrowRight
} from 'lucide-react';

const Referral = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const fallbackReferralCode = user?.id?.substring(0, 8).toUpperCase() || 'STUDY2024';
  const [referralCode, setReferralCode] = useState(fallbackReferralCode);

  useEffect(() => {
    if (!user) return;

    const fallback = user.id?.substring(0, 8).toUpperCase() || 'STUDY2024';
    setReferralCode(fallback);

    let cancelled = false;

    const resolveReferralCode = async () => {
      // Force for this account only (email or user id)
      if (
        user.id === '6a45c27a-8874-48ce-8a52-ea6232730c90' ||
        user.email?.toLowerCase() === 'oladepocaleb2020@gmail.com'
      ) {
        setReferralCode('CalebTech');
        return;
      }

      const candidates: string[] = [];

      // Standard format: FirstNameTech (only if it exists in referral_codes)
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      const firstName = profile?.full_name?.trim().split(/\s+/)[0];
      if (firstName) candidates.push(`${firstName}Tech`);

      for (const code of candidates) {
        const { data: row } = await supabase
          .from('referral_codes')
          .select('code')
          .ilike('code', code)
          .eq('is_active', true)
          .maybeSingle();

        if (row?.code) {
          if (!cancelled) setReferralCode(row.code);
          return;
        }
      }
    };

    resolveReferralCode();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.email]);

  const referralLink = `https://studyearn.app/signup?ref=${encodeURIComponent(referralCode)}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Referral link copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const referralPlans = [
    {
      name: 'Bronze Referrer',
      icon: Medal,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      requirement: '1-5 Referrals',
      rewards: [
        '50 points per successful referral',
        'Bronze badge on profile',
        'Early access to new features'
      ],
      bonus: 50
    },
    {
      name: 'Silver Referrer',
      icon: Medal,
      color: 'text-gray-400',
      bgColor: 'bg-gray-100',
      requirement: '6-15 Referrals',
      rewards: [
        '75 points per successful referral',
        'Silver badge on profile',
        '10% bonus on all earnings',
        'Priority support'
      ],
      bonus: 75
    },
    {
      name: 'Gold Referrer',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      requirement: '16-30 Referrals',
      rewards: [
        '100 points per successful referral',
        'Gold badge on profile',
        '20% bonus on all earnings',
        'Exclusive challenges access',
        'Featured in community'
      ],
      bonus: 100
    },
    {
      name: 'Diamond Referrer',
      icon: Crown,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      requirement: '31+ Referrals',
      rewards: [
        '150 points per successful referral',
        'Diamond badge on profile',
        '30% bonus on all earnings',
        'VIP support channel',
        'Monthly gift cards',
        'Ambassador perks'
      ],
      bonus: 150
    }
  ];

  const recentReferrals = [
    { name: 'Ada Okonkwo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ada', date: '2 days ago', status: 'completed', reward: 50 },
    { name: 'Chinedu Eze', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chinedu', date: '5 days ago', status: 'completed', reward: 50 },
    { name: 'Fatima Yusuf', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima', date: '1 week ago', status: 'pending', reward: 0 },
  ];

  const stats = {
    totalReferrals: 3,
    completedReferrals: 2,
    pendingReferrals: 1,
    totalEarned: 100,
    currentTier: 'Bronze',
    nextTier: 'Silver',
    referralsToNextTier: 4
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 font-display text-4xl font-bold flex items-center gap-3">
            <Gift className="h-10 w-10 text-primary" />
            Referral Program
          </h1>
          <p className="text-muted-foreground">
            Invite friends to StudyEarn and earn rewards together!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4 border-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-success/10 p-3">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedReferrals}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-warning/10 p-3">
                <Coins className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalEarned}</p>
                <p className="text-sm text-muted-foreground">Points Earned</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-2 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/20 p-3">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">{stats.currentTier}</p>
                <p className="text-sm text-muted-foreground">{stats.referralsToNextTier} more to {stats.nextTier}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="border-2 p-6">
          <h2 className="mb-4 font-display text-xl font-bold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Your Referral Link
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input 
                  value={referralLink} 
                  readOnly 
                  className="bg-muted"
                />
                <Button 
                  onClick={() => copyToClipboard(referralLink)}
                  variant={copied ? 'default' : 'outline'}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Referral Code: <span className="font-mono font-bold text-primary">{referralCode}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Twitter
              </Button>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="tiers" className="w-full">
          <TabsList>
            <TabsTrigger value="tiers">Referral Tiers</TabsTrigger>
            <TabsTrigger value="history">My Referrals</TabsTrigger>
            <TabsTrigger value="how">How It Works</TabsTrigger>
          </TabsList>

          <TabsContent value="tiers" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {referralPlans.map((plan, index) => (
                <Card 
                  key={plan.name} 
                  className={`border-2 p-6 transition-smooth hover:shadow-lg ${
                    stats.currentTier === plan.name.split(' ')[0] ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-3 ${plan.bgColor}`}>
                        <plan.icon className={`h-6 w-6 ${plan.color}`} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.requirement}</p>
                      </div>
                    </div>
                    {stats.currentTier === plan.name.split(' ')[0] && (
                      <Badge className="bg-primary">Current</Badge>
                    )}
                  </div>
                  <div className="mb-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-primary" />
                      <span className="font-bold text-lg">{plan.bonus} pts</span>
                      <span className="text-sm text-muted-foreground">per referral</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plan.rewards.map((reward, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        {reward}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="border-2">
              <div className="p-4 border-b">
                <h3 className="font-display font-bold">Recent Referrals</h3>
              </div>
              <div className="divide-y">
                {recentReferrals.map((referral, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={referral.avatar} />
                        <AvatarFallback>{referral.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{referral.name}</p>
                        <p className="text-sm text-muted-foreground">{referral.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                        {referral.status}
                      </Badge>
                      {referral.reward > 0 && (
                        <span className="font-bold text-primary">+{referral.reward} pts</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="how" className="mt-6">
            <Card className="border-2 p-6">
              <h3 className="font-display text-xl font-bold mb-6">How the Referral Program Works</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Share2 className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-bold mb-2">1. Share Your Link</h4>
                  <p className="text-sm text-muted-foreground">
                    Copy your unique referral link and share it with friends, family, and classmates.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-bold mb-2">2. Friends Sign Up</h4>
                  <p className="text-sm text-muted-foreground">
                    When someone signs up using your link and completes their first module, it counts!
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-bold mb-2">3. Earn Rewards</h4>
                  <p className="text-sm text-muted-foreground">
                    You both get points! The more referrals, the higher your tier and better rewards.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h4 className="font-bold">Pro Tips</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    Share in study groups and WhatsApp communities
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    Help your referrals complete their first module for faster activation
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    Refer consistently to reach higher tiers and unlock better rewards
                  </li>
                </ul>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Referral;
