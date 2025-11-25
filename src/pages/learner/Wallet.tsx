import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Wallet = () => {
  const { toast } = useToast();
  const balance = 245.5;
  const totalEarned = 1250.0;
  const totalWithdrawn = 800.0;
  const totalRedeemed = 204.5;

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Initiated",
      description: "Your withdrawal request is being processed. Funds will be transferred within 2-3 business days.",
    });
  };

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
      status: 'completed',
      date: '2025-01-15T10:30:00',
    },
    {
      id: '2',
      type: 'earn',
      description: 'Completed JavaScript Advanced Module',
      amount: 35.0,
      status: 'completed',
      date: '2024-12-28T14:20:00',
    },
    {
      id: '3',
      type: 'redeem',
      description: 'Amazon Gift Card - $50',
      amount: -50.0,
      status: 'completed',
      date: '2024-12-20T15:20:00',
    },
    {
      id: '4',
      type: 'earn',
      description: '7-Day Streak Bonus',
      amount: 25.0,
      status: 'completed',
      date: '2024-12-14T00:00:00',
    },
    {
      id: '5',
      type: 'withdraw',
      description: 'Bank Transfer',
      amount: -100.0,
      status: 'pending',
      date: '2024-11-25T14:15:00',
    },
    {
      id: '6',
      type: 'earn',
      description: 'Completed Web Dev Module 3',
      amount: 40.0,
      status: 'completed',
      date: '2024-11-18T18:45:00',
    },
    {
      id: '7',
      type: 'referral',
      description: 'Referral Bonus - Sarah J.',
      amount: 20.0,
      status: 'completed',
      date: '2024-10-30T09:30:00',
    },
    {
      id: '8',
      type: 'earn',
      description: 'Completed React Fundamentals',
      amount: 45.0,
      status: 'completed',
      date: '2024-10-15T16:00:00',
    },
    {
      id: '9',
      type: 'redeem',
      description: 'Course Discount Voucher',
      amount: -25.0,
      status: 'completed',
      date: '2024-09-28T11:45:00',
    },
    {
      id: '10',
      type: 'earn',
      description: 'Monthly Achievement Bonus',
      amount: 50.0,
      status: 'completed',
      date: '2024-09-01T00:00:00',
    },
    {
      id: '11',
      type: 'withdraw',
      description: 'PayPal Transfer',
      amount: -150.0,
      status: 'completed',
      date: '2024-08-22T10:30:00',
    },
    {
      id: '12',
      type: 'earn',
      description: 'Completed TypeScript Course',
      amount: 55.0,
      status: 'completed',
      date: '2024-08-10T13:20:00',
    },
    {
      id: '13',
      type: 'referral',
      description: 'Referral Bonus - Mike R.',
      amount: 20.0,
      status: 'completed',
      date: '2024-07-25T08:15:00',
    },
    {
      id: '14',
      type: 'earn',
      description: 'Completed Node.js Backend Course',
      amount: 60.0,
      status: 'completed',
      date: '2024-07-05T17:30:00',
    },
    {
      id: '15',
      type: 'redeem',
      description: 'Premium Course Access',
      amount: -80.0,
      status: 'completed',
      date: '2024-06-18T14:00:00',
    },
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Transaction History', 14, 20);
    
    // Account info
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Balance: $${balance.toFixed(2)}`, 14, 36);
    
    // Table
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

        {/* Balance Card */}
        <Card className="border-2 bg-gradient-to-br from-primary to-secondary p-8 text-white">
          <div className="mb-6">
            <p className="mb-2 text-sm opacity-90">Available Balance</p>
            <p className="font-display text-6xl font-bold">${balance.toFixed(2)}</p>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleWithdraw}
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

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
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

          <div className="space-y-4">
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
    </DashboardLayout>
  );
};

export default Wallet;
