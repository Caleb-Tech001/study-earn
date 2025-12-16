import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { useWallet } from '@/contexts/WalletContext';
import { Gift, Check, Loader2, Copy, Mail } from 'lucide-react';

interface RedeemModalProps {
  open: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    description: string;
    cost: number;
    category: string;
  } | null;
}

export const RedeemModal = ({ open, onClose, item }: RedeemModalProps) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { balance, deductBalance, addTransaction } = useWallet();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  if (!item) return null;

  const handleConfirmRedeem = () => {
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email to receive the gift card code',
        variant: 'destructive',
      });
      return;
    }

    if (balance < item.cost) {
      toast({
        title: 'Insufficient Balance',
        description: `You need $${(item.cost - balance).toFixed(2)} more to redeem this item.`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simulate processing
    setTimeout(() => {
      // Deduct balance
      deductBalance(item.cost);
      
      // Add transaction
      addTransaction({
        type: 'redeem',
        description: `Redeemed: ${item.title}`,
        amount: -item.cost,
        points: -Math.round(item.cost * 1000),
        status: 'completed',
      });

      // Generate fake gift card code
      const code = `${item.title.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setGeneratedCode(code);

      addNotification({
        title: 'Gift Card Redeemed! 🎉',
        message: `Your ${item.title} code has been sent to ${email}`,
        type: 'success',
      });

      setIsLoading(false);
      setStep(2);
    }, 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: 'Code Copied!',
      description: 'Gift card code copied to clipboard',
    });
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setGeneratedCode('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {step === 2 ? 'Redemption Complete!' : 'Redeem Gift Card'}
          </DialogTitle>
        </DialogHeader>

        {step === 2 ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Successfully Redeemed!</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Your {item.title} has been processed
            </p>

            <Card className="mb-4 p-4 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Your Gift Card Code</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-lg font-mono font-bold">{generatedCode}</code>
                <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Mail className="h-4 w-4" />
              <span>Code also sent to {email}</span>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Item Preview */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-primary">${item.cost}</p>
                </div>
              </div>
            </Card>

            {/* Email Input */}
            <div>
              <Label>Email Address</Label>
              <p className="text-xs text-muted-foreground mb-2">
                We'll send your gift card code to this email
              </p>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            {/* Summary */}
            <Card className="p-4 bg-muted/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Item Cost</span>
                <span>${item.cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Your Balance</span>
                <span>${balance.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Remaining Balance</span>
                <span className={balance >= item.cost ? 'text-success' : 'text-destructive'}>
                  ${Math.max(0, balance - item.cost).toFixed(2)}
                </span>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmRedeem} 
                className="flex-1"
                disabled={isLoading || balance < item.cost}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Redemption'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
