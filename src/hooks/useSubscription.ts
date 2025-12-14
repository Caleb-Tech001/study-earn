import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SubscriptionStatus {
  subscribed: boolean;
  plan: 'free' | 'basic' | 'premium';
  productId: string | null;
  subscriptionEnd: string | null;
  isLoading: boolean;
}

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    productId: null,
    features: [
      'Access to free courses',
      'Community forum access',
      'Basic earning opportunities',
      'Standard support',
    ],
  },
  basic: {
    name: 'Basic',
    price: 19.99,
    priceId: 'price_1Se4QTRwJ0QGMzGgebNgPFjL',
    productId: 'prod_TbEm4Avua126as',
    features: [
      'All Free features',
      'Access to all courses',
      '2x points multiplier',
      'Priority community support',
      'Exclusive webinars',
    ],
  },
  premium: {
    name: 'Premium',
    price: 29.99,
    priceId: 'price_1Se4QCRwJ0QGMzGgT1wFLUE6',
    productId: 'prod_TbEmUvivEorCu0',
    features: [
      'All Basic features',
      '5x points multiplier',
      '1-on-1 mentorship sessions',
      'Certificate of completion',
      'Early access to new content',
      'Premium support',
    ],
  },
};

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscribed: false,
    plan: 'free',
    productId: null,
    subscriptionEnd: null,
    isLoading: true,
  });

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setSubscription(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setSubscription({
        subscribed: data.subscribed,
        plan: data.plan || 'free',
        productId: data.product_id,
        subscriptionEnd: data.subscription_end,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription(prev => ({ ...prev, isLoading: false }));
    }
  }, [session?.access_token]);

  useEffect(() => {
    checkSubscription();
    
    // Auto-refresh subscription status every minute
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [checkSubscription]);

  const createCheckout = async (priceId: string) => {
    if (!session?.access_token) {
      throw new Error('Please log in to subscribe');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    }
    
    return data;
  };

  const openCustomerPortal = async () => {
    if (!session?.access_token) {
      throw new Error('Please log in to manage your subscription');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    }
    
    return data;
  };

  return {
    ...subscription,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    tiers: SUBSCRIPTION_TIERS,
  };
};
