import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { WithdrawalModal } from '@/components/wallet/WithdrawalModal';
import {
  Wallet as WalletIcon,
  TrendingUp,
  Download,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Trophy,
  FileDown,
  Bitcoin,
  Coins,
  RefreshCw,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Wallet = () => {
  const { toast } = useToast();
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  
  const balance = 245.5;
  const pointsBalance = 24550;
  const totalEarned = 1250.0;
  const totalWithdrawn = 800.0;
  const totalRedeemed = 204.5;

  // Exchange rates
  const pointsToDollar = 1000; // 1000 points = $1
  const dollarToNaira = 1600; // $1 = ₦1600 (static rate)
  
  const nairaBalance = balance * dollarToNaira;

  const handleRedeem = () => {
    toast({
      title: "Redeem Rewards",
      description: "Browse available rewards in the Marketplace to redeem your balance.",
    });
  };

  const transactions = [
    {
      id: '1',
      type: 'earn',
      description: 'Completed Python Basics Quiz',
      amount: 15.0,
      points: 15000,
      status: 'completed',
      date: '2025-01-15T10:30:00',
    },
    {
      id: '2',
      type: 'earn',
      description: 'Completed JavaScript Advanced Module',
      amount: 35.0,
      points: 35000,
      status: 'completed',
      date: '2024-12-28T14:20:00',
    },
    {
      id: '3',
      type: 'redeem',
      description: 'Amazon Gift Card - $50',
      amount: -50.0,
      points: -50000,
      status: 'completed',
      date: '2024-12-20T15:20:00',
    },
    {
      id: '4',
      type: 'earn',
      description: '7-Day Streak Bonus',
      amount: 25.0,
      points: 25000,
      status: 'completed',
      date: '2024-12-14T00:00:00',
    },
    {
      id: '5',
      type: 'withdraw',
      description: 'Bank Transfer - OPay',
      amount: -100.0,
      points: -100000,
      status: 'pending',
      date: '2024-11-25T14:15:00',
    },
    {
      id: '6',
      type: 'earn',
      description: 'Completed Web Dev Module 3',
      amount: 40.0,
      points: 40000,
      status: 'completed',
      date: '2024-11-18T18:45:00',
    },
    {
      id: '7',
      type: 'referral',
      description: 'Referral Bonus - Sarah J.',
      amount: 20.0,
      points: 20000,
      status: 'completed',
      date: '2024-10-30T09:30:00',
    },
    {
      id: '8',
      type: 'withdraw',
      description: 'Crypto - USDT (TRC20)',
      amount: -50.0,
      points: -50000,
      status: 'completed',
      date: '2024-10-15T16:00:00',
    },
    {
      id: '9',
      type: 'conversion',
      description: 'Points Conversion',
      amount: 25.0,
      points: 25000,
      status: 'completed',
      date: '2024-09-28T11:45:00',
    },
    {
      id: '10',
      type: 'earn',
      description: 'Monthly Achievement Bonus',
      amount: 50.0,
      points: 50000,
      status: 'completed',
      date: '2024-09-01T00:00:00',
    },
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Transaction History', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Balance: $${balance.toFixed(2)} (₦${nairaBalance.toLocaleString()})`, 14, 36);
    
    autoTable(doc, {
      startY: 45,
      head: [['Date', 'Description', 'Type', 'Amount', 'Status']],
      body: transactions.map(t => [
        new Date(t.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        t.description,
        t.type.charAt(0).toUpperCase() + t.type.slice(1),
        `$${Math.abs(t.amount).toFixed(2)}`,
        t.status.charAt(0).toUpperCase() + t.status.slice(1)
      ]),
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
    });
    
    doc.save('transaction-history.pdf');
    
    toast({
      title: "PDF Downloaded",
      description: "Your transaction history has been exported successfully.",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
        return <Trophy className="h-5 w-5 text-success" />;
      case 'withdraw':
        return <Download className="h-5 w-5 text-primary" />;
      case 'redeem':
        return <ShoppingBag className="h-5 w-5 text-accent" />;
      case 'referral':
        return <Gift className="h-5 w-5 text-secondary" />;
      case 'conversion':
        return <RefreshCw className="h-5 w-5 text-primary" />;
      default:
        return <WalletIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2 font-display text-4xl font-bold">My Wallet</h1>
          <p className="text-muted-foreground">
            Track your earnings, withdrawals, and redemptions
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Main Balance Card */}
          <Card className="border-2 bg-gradient-to-br from-primary to-secondary p-6 text-white">
            <div className="mb-4">
              <p className="mb-1 text-sm opacity-90">Available Balance</p>
              <p className="font-display text-5xl font-bold">${balance.toFixed(2)}</p>
              <p className="mt-1 text-sm opacity-80">≈ ₦{nairaBalance.toLocaleString()}</p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => setIsWithdrawalOpen(true)}
                className="flex-1 bg-white text-primary hover:bg-white/90"
              >
                <Download className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
              <Button 
                onClick={handleRedeem}
                className="flex-1 bg-white/20 text-white border border-white/30 hover:bg-white/30"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Redeem
              </Button>
            </div>
          </Card>

          {/* Points Card */}
          <Card className="border-2 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Points Balance</p>
                <p className="font-display text-4xl font-bold text-primary">{pointsBalance.toLocaleString()}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pointsToDollar.toLocaleString()} points = $1
                </p>
              </div>
              <div className="rounded-xl bg-primary/10 p-4">
                <Coins className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Exchange Rate: $1 = ₦{dollarToNaira.toLocaleString()}</span>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <div className="rounded-lg bg-success/10 p-2">
                <ArrowUpRight className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="font-display text-3xl font-bold">${totalEarned.toFixed(2)}</p>
            <p className="mt-2 text-sm text-success">+12% from last month</p>
          </Card>

          <Card className="border-2 p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Withdrawn</p>
              <div className="rounded-lg bg-primary/10 p-2">
                <Download className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="font-display text-3xl font-bold">${totalWithdrawn.toFixed(2)}</p>
            <p className="mt-2 text-sm text-muted-foreground">4 transactions</p>
          </Card>

          <Card className="border-2 p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Redeemed</p>
              <div className="rounded-lg bg-accent/10 p-2">
                <ShoppingBag className="h-5 w-5 text-accent" />
              </div>
            </div>
            <p className="font-display text-3xl font-bold">${totalRedeemed.toFixed(2)}</p>
            <p className="mt-2 text-sm text-muted-foreground">8 items</p>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="border-2 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Transaction History</h2>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-smooth hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-muted p-2">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {transaction.status}
                  </Badge>
                  <p
                    className={`font-display text-lg font-bold ${
                      transaction.amount > 0 ? 'text-success' : 'text-foreground'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Withdrawal Modal */}
      <WithdrawalModal 
        open={isWithdrawalOpen} 
        onClose={() => setIsWithdrawalOpen(false)}
        balance={balance}
        nairaRate={dollarToNaira}
      />
    </DashboardLayout>
  );
};

export default Wallet;