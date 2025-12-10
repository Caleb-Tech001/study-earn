import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WalletContextType {
  balance: number;
  pointsBalance: number;
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  addPoints: (points: number) => void;
  deductPoints: (points: number) => boolean;
  convertPointsToBalance: (points: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const POINTS_TO_DOLLAR = 1000; // 1000 points = $1

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(245.5);
  const [pointsBalance, setPointsBalance] = useState(24550);
  const { toast } = useToast();

  const addBalance = useCallback((amount: number) => {
    setBalance((prev) => prev + amount);
    toast({
      title: 'Balance Updated! 💰',
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
    setPointsBalance((prev) => prev + points);
    toast({
      title: 'Points Earned! 🎉',
      description: `+${points.toLocaleString()} points added to your balance`,
    });
  }, [toast]);

  const deductPoints = useCallback((points: number): boolean => {
    if (pointsBalance < points) {
      toast({
        title: 'Insufficient Points',
        description: `You need ${(points - pointsBalance).toLocaleString()} more points`,
        variant: 'destructive',
      });
      return false;
    }
    setPointsBalance((prev) => prev - points);
    return true;
  }, [pointsBalance, toast]);

  const convertPointsToBalance = useCallback((points: number) => {
    if (pointsBalance < points) {
      toast({
        title: 'Insufficient Points',
        description: `You don't have enough points to convert`,
        variant: 'destructive',
      });
      return;
    }
    const dollarAmount = points / POINTS_TO_DOLLAR;
    setPointsBalance((prev) => prev - points);
    setBalance((prev) => prev + dollarAmount);
    toast({
      title: 'Conversion Complete! 🔄',
      description: `Converted ${points.toLocaleString()} points to $${dollarAmount.toFixed(2)}`,
    });
  }, [pointsBalance, toast]);

  return (
    <WalletContext.Provider
      value={{
        balance,
        pointsBalance,
        addBalance,
        deductBalance,
        addPoints,
        deductPoints,
        convertPointsToBalance,
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
