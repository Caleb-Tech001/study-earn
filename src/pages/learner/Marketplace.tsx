import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  ShoppingBag,
  Gift,
  Smartphone,
  Coffee,
  BookOpen,
  Ticket,
  FileText,
  Palette,
  Gamepad2,
  Sparkles,
  Search,
  Plus,
  Star,
  Upload,
} from 'lucide-react';

const Marketplace = () => {
  const { toast } = useToast();
  const walletBalance = 245.5;
  const [activeTab, setActiveTab] = useState('rewards');

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

  const digitalProducts = [
    {
      id: 'd1',
      title: 'Advanced Puzzle Pack',
      description: '50 new crossword puzzles',
      cost: 5,
      icon: Gamepad2,
      category: 'Games',
      seller: 'StudyEarn',
    },
    {
      id: 'd2',
      title: 'Learning Booster',
      description: '2x points for 24 hours',
      cost: 10,
      icon: Sparkles,
      category: 'Boosters',
      seller: 'StudyEarn',
    },
    {
      id: 'd3',
      title: 'Premium Avatar Pack',
      description: '10 exclusive avatars',
      cost: 8,
      icon: Palette,
      category: 'Cosmetics',
      seller: 'StudyEarn',
    },
    {
      id: 'd4',
      title: 'Dark Theme Pro',
      description: 'Premium dark theme',
      cost: 3,
      icon: Palette,
      category: 'Themes',
      seller: 'StudyEarn',
    },
  ];

  const userProducts = [
    {
      id: 'u1',
      title: 'Python Basics Cheat Sheet',
      description: 'Complete Python syntax reference',
      cost: 2,
      icon: FileText,
      category: 'Study Notes',
      seller: 'Sarah W.',
      rating: 4.8,
      sales: 156,
    },
    {
      id: 'u2',
      title: 'JAMB Past Questions 2024',
      description: '10 years of past questions with solutions',
      cost: 5,
      icon: BookOpen,
      category: 'Past Questions',
      seller: 'Michael C.',
      rating: 4.9,
      sales: 342,
    },
    {
      id: 'u3',
      title: 'Web Dev Project Templates',
      description: '15 ready-to-use HTML/CSS templates',
      cost: 8,
      icon: FileText,
      category: 'Templates',
      seller: 'Emma D.',
      rating: 4.7,
      sales: 89,
    },
    {
      id: 'u4',
      title: 'JavaScript Practice Exercises',
      description: '100 exercises with solutions',
      cost: 6,
      icon: BookOpen,
      category: 'Practice Exercises',
      seller: 'Alex T.',
      rating: 4.6,
      sales: 234,
    },
    {
      id: 'u5',
      title: 'Canva Design Assets',
      description: '50 editable design templates',
      cost: 10,
      icon: Palette,
      category: 'Digital Design',
      seller: 'Jennifer L.',
      rating: 4.9,
      sales: 178,
    },
    {
      id: 'u6',
      title: 'Mini E-Book: Learn React',
      description: 'Beginner-friendly React guide',
      cost: 4,
      icon: BookOpen,
      category: 'Mini-Books',
      seller: 'David P.',
      rating: 4.5,
      sales: 67,
    },
  ];

  const handleRedeem = (item: typeof rewards[0] | typeof digitalProducts[0]) => {
    if (walletBalance >= item.cost) {
      toast({
        title: "Purchase Successful! 🎉",
        description: `You've redeemed ${item.title} for $${item.cost}`,
      });
    } else {
      toast({
        title: "Insufficient Balance",
        description: `You need $${(item.cost - walletBalance).toFixed(2)} more to purchase this item.`,
        variant: "destructive",
      });
    }
  };

  const handleBuyProduct = (product: typeof userProducts[0]) => {
    if (walletBalance >= product.cost) {
      toast({
        title: "Purchase Successful! 🎉",
        description: `You've purchased "${product.title}" from ${product.seller}. Check your downloads!`,
      });
    } else {
      toast({
        title: "Insufficient Balance",
        description: `You need $${(product.cost - walletBalance).toFixed(2)} more to purchase this item.`,
        variant: "destructive",
      });
    }
  };

  const handleSellItem = () => {
    toast({
      title: "Upload Your Product",
      description: "Complete the form to list your digital product. StudyEarn takes a 10% commission on each sale.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 font-display text-4xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">
              Redeem rewards, buy digital products, or sell your own creations
            </p>
          </div>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="font-display text-2xl font-bold">${walletBalance}</p>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-2 p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
            <Button onClick={handleSellItem}>
              <Plus className="mr-2 h-4 w-4" />
              Sell Product
            </Button>
          </div>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="digital">Digital Products</TabsTrigger>
            <TabsTrigger value="community">Community Market</TabsTrigger>
          </TabsList>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="mt-6">
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
          </TabsContent>

          {/* Digital Products Tab */}
          <TabsContent value="digital" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {digitalProducts.map((product) => (
                <Card key={product.id} className="border-2 p-6 transition-smooth hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-xl bg-accent/10 p-3">
                      <product.icon className="h-6 w-6 text-accent" />
                    </div>
                    <Badge>{product.category}</Badge>
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold">{product.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-primary">
                      ${product.cost}
                    </span>
                    <Button 
                      size="sm"
                      onClick={() => handleRedeem(product)}
                      disabled={walletBalance < product.cost}
                    >
                      Buy
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Community Market Tab */}
          <TabsContent value="community" className="mt-6">
            <div className="mb-6">
              <Card className="border-2 border-dashed p-6 text-center">
                <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-display text-xl font-bold">Sell Your Digital Products</h3>
                <p className="mb-4 text-muted-foreground">
                  Upload templates, study notes, past questions, and more. Earn money while helping others learn!
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  StudyEarn takes a 10% commission on each sale
                </p>
                <Button onClick={handleSellItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Selling
                </Button>
              </Card>
            </div>

            <h3 className="mb-4 font-display text-xl font-bold">Popular Products</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userProducts.map((product) => (
                <Card key={product.id} className="border-2 p-6 transition-smooth hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-xl bg-secondary/10 p-3">
                      <product.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold">{product.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{product.description}</p>
                  
                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>by {product.seller}</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      {product.rating}
                    </span>
                    <span>{product.sales} sold</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-primary">
                      ${product.cost}
                    </span>
                    <Button 
                      onClick={() => handleBuyProduct(product)}
                      disabled={walletBalance < product.cost}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Buy
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;