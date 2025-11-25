import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ShoppingBag,
  Gift,
  Smartphone,
  Coffee,
  BookOpen,
  Ticket,
} from 'lucide-react';

const Marketplace = () => {
  const { toast } = useToast();
  const walletBalance = 245.5;

  const rewards = [
    {
      id: '1',
      title: 'Amazon Gift Card',
      description: '$25 Amazon gift card',
      cost: 25,
      icon: Gift,
      category: 'Gift Cards',
    },
    {
      id: '2',
      title: 'Starbucks Gift Card',
      description: '$10 Starbucks card',
      cost: 10,
      icon: Coffee,
      category: 'Food & Beverage',
    },
    {
      id: '3',
      title: 'Premium Course Access',
      description: '1 month premium courses',
      cost: 50,
      icon: BookOpen,
      category: 'Education',
    },
    {
      id: '4',
      title: 'Movie Tickets',
      description: '2 movie tickets',
      cost: 20,
      icon: Ticket,
      category: 'Entertainment',
    },
    {
      id: '5',
      title: 'App Store Gift Card',
      description: '$15 App Store credit',
      cost: 15,
      icon: Smartphone,
      category: 'Gift Cards',
    },
  ];

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (walletBalance >= reward.cost) {
      toast({
        title: "Reward Redeemed!",
        description: `You've redeemed ${reward.title} for $${reward.cost}`,
      });
    } else {
      toast({
        title: "Insufficient Balance",
        description: `You need $${reward.cost - walletBalance} more to redeem this reward.`,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-display text-4xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">
              Redeem your earned tokens for amazing rewards
            </p>
          </div>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="font-display text-2xl font-bold">${walletBalance}</p>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward) => (
            <Card key={reward.id} className="border-2 p-6 transition-smooth hover:shadow-lg">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-xl bg-primary/10 p-3">
                  <reward.icon className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary">{reward.category}</Badge>
              </div>
              <h3 className="mb-2 font-display text-xl font-bold">{reward.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{reward.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-bold text-primary">
                  ${reward.cost}
                </span>
                <Button 
                  onClick={() => handleRedeem(reward)}
                  disabled={walletBalance < reward.cost}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Redeem
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
