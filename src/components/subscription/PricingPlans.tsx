import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Crown, Sparkles, Zap } from 'lucide-react';
import { useSubscription, SUBSCRIPTION_TIERS } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PricingPlansProps {
  onSuccess?: () => void;
}

export const PricingPlans = ({ onSuccess }: PricingPlansProps) => {
  const { plan: currentPlan, subscribed, createCheckout, openCustomerPortal, isLoading } = useSubscription();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (tierKey: string) => {
    const tier = SUBSCRIPTION_TIERS[tierKey as keyof typeof SUBSCRIPTION_TIERS];
    if (!tier.priceId) return;

    setLoadingPlan(tierKey);
    try {
      await createCheckout(tier.priceId);
      toast({
        title: 'Checkout Started',
        description: 'Complete your subscription in the new tab.',
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start checkout',
        variant: 'destructive',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPlan('manage');
    try {
      await openCustomerPortal();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to open billing portal',
        variant: 'destructive',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const getPlanIcon = (key: string) => {
    switch (key) {
      case 'premium':
        return <Crown className="h-6 w-6" />;
      case 'basic':
        return <Sparkles className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => {
          const isCurrentPlan = currentPlan === key;
          const isPremium = key === 'premium';
          
          return (
            <Card
              key={key}
              className={cn(
                'relative flex flex-col border-2 p-6 transition-all',
                isCurrentPlan && 'border-primary ring-2 ring-primary/20',
                isPremium && !isCurrentPlan && 'border-amber-500/50'
              )}
            >
              {isCurrentPlan && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Your Plan
                </Badge>
              )}
              {isPremium && !isCurrentPlan && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500">
                  Most Popular
                </Badge>
              )}

              <div className="mb-4 flex items-center gap-3">
                <div className={cn(
                  'rounded-lg p-2',
                  isCurrentPlan ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                  isPremium && !isCurrentPlan && 'bg-amber-500/10 text-amber-500'
                )}>
                  {getPlanIcon(key)}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{tier.name}</h3>
                  <p className="text-2xl font-bold">
                    ${tier.price}
                    {tier.price > 0 && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                  </p>
                </div>
              </div>

              <ul className="mb-6 flex-1 space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                subscribed ? (
                  <Button
                    variant="outline"
                    onClick={handleManageSubscription}
                    disabled={loadingPlan === 'manage'}
                  >
                    {loadingPlan === 'manage' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Manage Subscription'
                    )}
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    Current Plan
                  </Button>
                )
              ) : tier.priceId ? (
                <Button
                  onClick={() => handleSubscribe(key)}
                  disabled={loadingPlan === key}
                  className={cn(
                    isPremium && 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                  )}
                >
                  {loadingPlan === key ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Upgrade to ${tier.name}`
                  )}
                </Button>
              ) : (
                <Button variant="ghost" disabled>
                  Free Forever
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {subscribed && (
        <div className="text-center">
          <Button variant="link" onClick={handleManageSubscription} disabled={loadingPlan === 'manage'}>
            {loadingPlan === 'manage' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Opening portal...
              </>
            ) : (
              'Manage billing & invoices'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
