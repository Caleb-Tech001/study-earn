import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { nigerianBanks, cryptoExchanges, networkFees, usdToNaira } from '@/utils/bankData';
import { Building2, Bitcoin, ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';

interface WithdrawalModalProps {
  open: boolean;
  onClose: () => void;
  balance: number;
}

export const WithdrawalModal = ({ open, onClose, balance }: WithdrawalModalProps) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [withdrawType, setWithdrawType] = useState<'bank' | 'crypto'>('bank');
  const [isLoading, setIsLoading] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);
  
  // Bank withdrawal state
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  
  // Crypto withdrawal state
  const [selectedExchange, setSelectedExchange] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const withdrawalFee = withdrawType === 'bank' ? 1.50 : networkFees[selectedNetwork] || 0;
  const amountNum = parseFloat(amount) || 0;
  const nairaEquivalent = amountNum * usdToNaira;
  const finalAmount = amountNum - withdrawalFee;

  const handleVerifyAccount = () => {
    if (accountNumber.length !== 10) {
      toast({
        title: 'Invalid Account Number',
        description: 'Please enter a valid 10-digit account number',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call to verify account
    setTimeout(() => {
      const names = ['Caleb Oladepo', 'Adewale Okonkwo', 'Chukwuemeka Eze', 'Oluwaseun Abiodun'];
      setAccountName(names[Math.floor(Math.random() * names.length)]);
      setAccountVerified(true);
      setIsLoading(false);
      toast({
        title: 'Account Verified',
        description: 'Account name fetched successfully',
      });
    }, 1500);
  };

  const handleSubmitWithdrawal = () => {
    if (amountNum > balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough funds for this withdrawal',
        variant: 'destructive',
      });
      return;
    }

    if (amountNum < 5) {
      toast({
        title: 'Minimum Withdrawal',
        description: 'Minimum withdrawal amount is $5.00',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
      
      addNotification({
        title: 'Withdrawal Processing',
        message: `Your withdrawal of $${amountNum.toFixed(2)} is being processed. ${
          withdrawType === 'bank' ? 'Funds will arrive in 2-3 business days.' : 'Transaction will be confirmed shortly.'
        }`,
        type: 'info',
      });

      toast({
        title: 'Withdrawal Submitted!',
        description: 'Your request is being processed',
      });
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedBank('');
    setAccountNumber('');
    setAccountName('');
    setAmount('');
    setAccountVerified(false);
    setSelectedExchange('');
    setSelectedNetwork('');
    setWalletAddress('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {step === 3 ? 'Withdrawal Submitted' : 'Withdraw Funds'}
          </DialogTitle>
        </DialogHeader>

        {step === 3 ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Request Submitted!</h3>
            <p className="mb-6 text-muted-foreground">
              Your withdrawal of <span className="font-bold">${amountNum.toFixed(2)}</span> is being processed.
              {withdrawType === 'bank' && (
                <span className="block mt-2">≈ ₦{nairaEquivalent.toLocaleString()}</span>
              )}
            </p>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <Tabs value={withdrawType} onValueChange={(v) => setWithdrawType(v as 'bank' | 'crypto')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bank" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Bank
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="gap-2">
                    <Bitcoin className="h-4 w-4" />
                    Crypto
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bank" className="space-y-4 mt-4">
                  <div>
                    <Label>Select Bank</Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose your bank" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {nigerianBanks.map((bank) => (
                          <SelectItem key={bank.code} value={bank.code}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Account Number</Label>
                    <div className="mt-1 flex gap-2">
                      <Input
                        value={accountNumber}
                        onChange={(e) => {
                          setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                          setAccountVerified(false);
                          setAccountName('');
                        }}
                        placeholder="Enter 10-digit account number"
                        maxLength={10}
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleVerifyAccount}
                        disabled={!selectedBank || accountNumber.length !== 10 || isLoading}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                      </Button>
                    </div>
                  </div>

                  {accountVerified && (
                    <Card className="border-success bg-success/5 p-3">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="font-medium">{accountName}</span>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="crypto" className="space-y-4 mt-4">
                  <div>
                    <Label>Select Exchange</Label>
                    <Select value={selectedExchange} onValueChange={(v) => {
                      setSelectedExchange(v);
                      setSelectedNetwork('');
                    }}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose exchange" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoExchanges.map((ex) => (
                          <SelectItem key={ex.code} value={ex.code}>
                            {ex.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedExchange && (
                    <div>
                      <Label>Select Network</Label>
                      <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose network" />
                        </SelectTrigger>
                        <SelectContent>
                          {cryptoExchanges
                            .find(ex => ex.code === selectedExchange)
                            ?.networks.map((network) => (
                              <SelectItem key={network} value={network}>
                                {network} (Fee: ${networkFees[network]})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label>Wallet Address</Label>
                    <Input
                      className="mt-1 font-mono text-sm"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter your wallet address"
                    />
                  </div>
                </TabsContent>

                <div className="mt-4 space-y-4">
                  <div>
                    <Label>Amount (USD)</Label>
                    <Input
                      type="number"
                      className="mt-1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      min={5}
                      max={balance}
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                      Available: ${balance.toFixed(2)}
                    </p>
                  </div>

                  {amountNum > 0 && (
                    <Card className="bg-muted/30 p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Amount</span>
                        <span>${amountNum.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fee</span>
                        <span className="text-destructive">-${withdrawalFee.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>You'll receive</span>
                        <span>${finalAmount.toFixed(2)}</span>
                      </div>
                      {withdrawType === 'bank' && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Naira equivalent</span>
                          <span>≈ ₦{(finalAmount * usdToNaira).toLocaleString()}</span>
                        </div>
                      )}
                    </Card>
                  )}

                  <Button 
                    className="w-full"
                    disabled={
                      (withdrawType === 'bank' && (!accountVerified || !amount)) ||
                      (withdrawType === 'crypto' && (!selectedNetwork || !walletAddress || !amount)) ||
                      isLoading
                    }
                    onClick={handleSubmitWithdrawal}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Confirm Withdrawal
                  </Button>
                </div>
              </Tabs>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
