import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Transaction {
  id: string;
  type: 'earn' | 'withdraw' | 'redeem' | 'referral' | 'conversion';
  description: string;
  amount: number;
  points: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

interface WalletContextType {
  balance: number;
  pointsBalance: number;
  transactions: Transaction[];
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  addPoints: (points: number) => void;
  deductPoints: (points: number) => boolean;
  convertPointsToBalance: (points: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  processWithdrawal: (amount: number, description: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const POINTS_TO_DOLLAR = 1000; // 1000 points = $1

// Helper to get user-specific storage keys
const getStorageKeys = (userId: string) => ({
  wallet: `studyearn_wallet_${userId}`,
  transactions: `studyearn_transactions_${userId}`,
  bonusProcessed: `studyearn_bonus_processed_${userId}`
});

// Load wallet state for specific user
const loadWalletState = (userId: string | null) => {
  if (!userId) return { balance: 0, transactions: [], bonusProcessed: false };
  
  try {
    const keys = getStorageKeys(userId);
    const savedBalance = localStorage.getItem(keys.wallet);
    const savedTransactions = localStorage.getItem(keys.transactions);
    const bonusProcessed = localStorage.getItem(keys.bonusProcessed) === 'true';
    
    return {
      balance: savedBalance ? parseFloat(savedBalance) : 0,
      transactions: savedTransactions ? JSON.parse(savedTransactions) : [],
      bonusProcessed
    };
  } catch {
    return { balance: 0, transactions: [], bonusProcessed: false };
  }
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasProcessedSignupBonus, setHasProcessedSignupBonus] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Listen for auth state changes to get user ID
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUserId = session?.user?.id ?? null;
        setUserId(newUserId);
        
        if (newUserId) {
          // Load user-specific wallet data
          const state = loadWalletState(newUserId);
          setBalance(state.balance);
          setTransactions(state.transactions);
          setHasProcessedSignupBonus(state.bonusProcessed);
          setIsInitialized(true);
        } else {
          // Reset to defaults when logged out
          setBalance(0);
          setTransactions([]);
          setHasProcessedSignupBonus(false);
          setIsInitialized(false);
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const newUserId = session?.user?.id ?? null;
      setUserId(newUserId);
      
      if (newUserId) {
        const state = loadWalletState(newUserId);
        setBalance(state.balance);
        setTransactions(state.transactions);
        setHasProcessedSignupBonus(state.bonusProcessed);
        setIsInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist balance to user-specific localStorage
  useEffect(() => {
    if (userId && isInitialized) {
      const keys = getStorageKeys(userId);
      localStorage.setItem(keys.wallet, balance.toString());
    }
  }, [balance, userId, isInitialized]);

  // Persist transactions to user-specific localStorage
  useEffect(() => {
    if (userId && isInitialized) {
      const keys = getStorageKeys(userId);
      localStorage.setItem(keys.transactions, JSON.stringify(transactions));
    }
  }, [transactions, userId, isInitialized]);

  // Process pending signup bonus on mount (user-specific)
  useEffect(() => {
    if (!userId || !isInitialized || hasProcessedSignupBonus) return;
    
    const pendingBonus = localStorage.getItem('pending_signup_bonus');
    if (pendingBonus) {
      try {
        const bonusData = JSON.parse(pendingBonus);
        
        // Only process if this bonus is for current user
        if (bonusData.userId !== userId) return;
        
        const totalBonus = (bonusData.baseBonus || 0.05) + (bonusData.referralBonus || 0);
        
        // Add the bonus to balance
        setBalance(prev => prev + totalBonus);
        
        // Create welcome transaction
        const signupTransaction: Transaction = {
          id: 'signup_bonus_' + Date.now(),
          type: 'earn',
          description: bonusData.referralCode 
            ? `Welcome Bonus + Referral (${bonusData.referralCode})` 
            : 'Welcome Signup Bonus',
          amount: totalBonus,
          points: Math.round(totalBonus * POINTS_TO_DOLLAR),
          status: 'completed',
          date: new Date().toISOString(),
        };
        
        setTransactions(prev => [signupTransaction, ...prev]);
        
        // Mark bonus as processed for this user
        const keys = getStorageKeys(userId);
        localStorage.setItem(keys.bonusProcessed, 'true');
        setHasProcessedSignupBonus(true);
        
        // Show toast notification
        setTimeout(() => {
          toast({
            title: '🎉 Welcome Bonus Received!',
            description: `You received $${totalBonus.toFixed(2)} signup bonus!`,
          });
        }, 1000);
        
        // Remove pending bonus from localStorage
        localStorage.removeItem('pending_signup_bonus');
      } catch (e) {
        console.error('Failed to process signup bonus:', e);
        localStorage.removeItem('pending_signup_bonus');
      }
    }
  }, [userId, isInitialized, hasProcessedSignupBonus, toast]);

  // Auto-complete pending withdrawals after 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => {
        const now = new Date().getTime();
        let hasChanges = false;
        const updated = prev.map(t => {
          if (t.status === 'pending') {
            const transactionTime = new Date(t.date).getTime();
            const twoMinutes = 2 * 60 * 1000;
            if (now - transactionTime >= twoMinutes) {
              hasChanges = true;
              return { ...t, status: 'completed' as const };
            }
          }
          return t;
        });
        if (hasChanges) {
          toast({
            title: 'Withdrawal Completed',
            description: 'Your withdrawal has been processed successfully!',
          });
        }
        return hasChanges ? updated : prev;
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [toast]);

  // Points = balance × 100
  const pointsBalance = Math.round(balance * POINTS_TO_DOLLAR);

  const addBalance = useCallback((amount: number) => {
    setBalance((prev) => prev + amount);
    toast({
      title: 'Balance Updated!',
      description: `+$${amount.toFixed(2)} added to your wallet`,
    });
  }, [toast]);

  const deductBalance = useCallback((amount: number): boolean => {
    if (balance < amount) {
      toast({
        title: 'Insufficient Balance',
        description: `You need $${(amount - balance).toFixed(2)} more to complete this purchase`,
        variant: 'destructive',
      });
      return false;
    }
    setBalance((prev) => prev - amount);
    return true;
  }, [balance, toast]);

  const addPoints = useCallback((points: number) => {
    const dollarAmount = points / POINTS_TO_DOLLAR;
    setBalance((prev) => prev + dollarAmount);
    toast({
      title: 'Points Earned!',
      description: `+${points.toLocaleString()} points added to your balance`,
    });
  }, [toast]);

  const deductPoints = useCallback((points: number): boolean => {
    const currentPoints = balance * POINTS_TO_DOLLAR;
    if (currentPoints < points) {
      toast({
        title: 'Insufficient Points',
        description: `You need ${(points - currentPoints).toLocaleString()} more points`,
        variant: 'destructive',
      });
      return false;
    }
    const dollarAmount = points / POINTS_TO_DOLLAR;
    setBalance((prev) => prev - dollarAmount);
    return true;
  }, [balance, toast]);

  const convertPointsToBalance = useCallback((points: number) => {
    // Points are now directly tied to balance, no separate conversion needed
    toast({
      title: 'Points Synced',
      description: `Your points balance is automatically synced with your dollar balance`,
    });
  }, [toast]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }, []);

  const processWithdrawal = useCallback((amount: number, description: string) => {
    // Deduct balance
    setBalance((prev) => prev - amount);
    
    // Add transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'withdraw',
      description,
      amount: -amount,
      points: -Math.round(amount * POINTS_TO_DOLLAR),
      status: 'pending',
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        balance,
        pointsBalance,
        transactions,
        addBalance,
        deductBalance,
        addPoints,
        deductPoints,
        convertPointsToBalance,
        addTransaction,
        processWithdrawal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
