import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

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

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'earn',
    description: 'Completed Python Basics Quiz',
    amount: 15.0,
    points: 1500,
    status: 'completed',
    date: '2025-01-15T10:30:00',
  },
  {
    id: '2',
    type: 'earn',
    description: 'Completed JavaScript Advanced Module',
    amount: 35.0,
    points: 3500,
    status: 'completed',
    date: '2024-12-28T14:20:00',
  },
  {
    id: '3',
    type: 'redeem',
    description: 'Amazon Gift Card - $50',
    amount: -50.0,
    points: -5000,
    status: 'completed',
    date: '2024-12-20T15:20:00',
  },
  {
    id: '4',
    type: 'earn',
    description: '7-Day Streak Bonus',
    amount: 25.0,
    points: 2500,
    status: 'completed',
    date: '2024-12-14T00:00:00',
  },
  {
    id: '5',
    type: 'earn',
    description: 'Completed Web Dev Module 3',
    amount: 40.0,
    points: 4000,
    status: 'completed',
    date: '2024-11-18T18:45:00',
  },
  {
    id: '6',
    type: 'referral',
    description: 'Referral Bonus - Sarah J.',
    amount: 20.0,
    points: 2000,
    status: 'completed',
    date: '2024-10-30T09:30:00',
  },
  {
    id: '7',
    type: 'earn',
    description: 'Monthly Achievement Bonus',
    amount: 50.0,
    points: 5000,
    status: 'completed',
    date: '2024-09-01T00:00:00',
  },
];

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasProcessedSignupBonus, setHasProcessedSignupBonus] = useState(false);
  const { toast } = useToast();

  // Process pending signup bonus on mount
  useEffect(() => {
    if (hasProcessedSignupBonus) return;
    
    const pendingBonus = localStorage.getItem('pending_signup_bonus');
    if (pendingBonus) {
      try {
        const bonusData = JSON.parse(pendingBonus);
        const totalBonus = (bonusData.baseBonus || 0.05) + (bonusData.referralBonus || 0);
        
        // Add the bonus to balance
        setBalance(totalBonus);
        
        // Create welcome transaction
        const signupTransaction: Transaction = {
          id: 'signup_bonus',
          type: 'earn',
          description: bonusData.referralCode 
            ? `Welcome Bonus + Referral (${bonusData.referralCode})` 
            : 'Welcome Signup Bonus',
          amount: totalBonus,
          points: Math.round(totalBonus * POINTS_TO_DOLLAR),
          status: 'completed',
          date: new Date().toISOString(),
        };
        
        setTransactions([signupTransaction]);
        
        // Show toast notification
        setTimeout(() => {
          toast({
            title: '🎉 Welcome Bonus Received!',
            description: `You received $${totalBonus.toFixed(2)} signup bonus!`,
          });
        }, 1000);
        
        // Remove from localStorage
        localStorage.removeItem('pending_signup_bonus');
        setHasProcessedSignupBonus(true);
      } catch (e) {
        console.error('Failed to process signup bonus:', e);
        localStorage.removeItem('pending_signup_bonus');
      }
    }
  }, [hasProcessedSignupBonus, toast]);

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
