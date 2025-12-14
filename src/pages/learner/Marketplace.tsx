import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCart, CartItem } from '@/contexts/CartContext';
import { UploadProductModal } from '@/components/marketplace/UploadProductModal';
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
  ShoppingCart,
} from 'lucide-react';

const Marketplace = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const walletBalance = 245.5;
  const [activeTab, setActiveTab] = useState('rewards');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [userListedProducts, setUserListedProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const rewards = [
    {
      id: 'r1',
      title: 'Amazon Gift Card',
      description: '$25 Amazon gift card',
      cost: 25,
      icon: Gift,
      category: 'Gift Cards',
    },
    {
      id: 'r2',
      title: 'Starbucks Gift Card',
      description: '$10 Starbucks card',
      cost: 10,
      icon: Coffee,
      category: 'Food & Beverage',
    },
    {
      id: 'r3',
      title: 'Premium Course Access',
      description: '1 month premium courses',
      cost: 50,
      icon: BookOpen,
      category: 'Education',
    },
    {
      id: 'r4',
      title: 'Movie Tickets',
      description: '2 movie tickets',
      cost: 20,
      icon: Ticket,
      category: 'Entertainment',
    },
    {
      id: 'r5',
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

  const handleAddToCart = (item: any, type: 'reward' | 'digital' | 'community') => {
    addToCart({
      id: item.id,
      title: item.title,
      description: item.description,
      cost: item.cost,
      category: item.category,
      seller: item.seller,
      type,
    });
  };

  const handleBuyNow = (item: any) => {
    if (walletBalance >= item.cost) {
      toast({
        title: 'Purchase Successful! 🎉',
        description: `You've purchased "${item.title}" for $${item.cost}`,
      });
    } else {
      toast({
        title: 'Insufficient Balance',
        description: `You need $${(item.cost - walletBalance).toFixed(2)} more to purchase this item.`,
        variant: 'destructive',
      });
    }
  };

  const handleProductAdded = (product: any) => {
    setUserListedProducts(prev => [...prev, {
      ...product,
      id: `user-${Date.now()}`,
      icon: FileText,
      seller: 'You',
      rating: 0,
      sales: 0,
    }]);
  };

  const allUserProducts = [...userListedProducts, ...userProducts];

  // Filter functions for each tab
  const filteredRewards = useMemo(() => {
    if (!searchQuery) return rewards;
    return rewards.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredDigitalProducts = useMemo(() => {
    if (!searchQuery) return digitalProducts;
    return digitalProducts.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredUserProducts = useMemo(() => {
    if (!searchQuery) return allUserProducts;
    return allUserProducts.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allUserProducts]);

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
              <Input 
                placeholder="Search products, rewards, or sellers..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowUploadModal(true)}>
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
            {filteredRewards.length === 0 ? (
              <Card className="border-2 p-8 text-center">
                <p className="text-muted-foreground">No rewards found matching "{searchQuery}"</p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRewards.map((reward) => (
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
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => handleAddToCart(reward, 'reward')}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleBuyNow(reward)}
                        disabled={walletBalance < reward.cost}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Redeem
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              </div>
            )}
          </TabsContent>

          {/* Digital Products Tab */}
          <TabsContent value="digital" className="mt-6">
            {filteredDigitalProducts.length === 0 ? (
              <Card className="border-2 p-8 text-center">
                <p className="text-muted-foreground">No digital products found matching "{searchQuery}"</p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {filteredDigitalProducts.map((product) => (
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
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => handleAddToCart(product, 'digital')}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleBuyNow(product)}
                        disabled={walletBalance < product.cost}
                      >
                        Buy
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              </div>
            )}
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
                <Button onClick={() => setShowUploadModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Selling
                </Button>
              </Card>
            </div>

            {userListedProducts.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-4 font-display text-xl font-bold">Your Listed Products</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userListedProducts.map((product) => (
                    <Card key={product.id} className="border-2 border-primary/30 bg-primary/5 p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="rounded-xl bg-primary/10 p-3">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <h3 className="mb-2 font-display text-lg font-bold">{product.title}</h3>
                      <p className="mb-3 text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xl font-bold text-primary">
                          ${product.cost}
                        </span>
                        <Badge className="bg-success text-success-foreground">Listed</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <h3 className="mb-4 font-display text-xl font-bold">Popular Products</h3>
            {filteredUserProducts.filter(p => p.seller !== 'You').length === 0 ? (
              <Card className="border-2 p-8 text-center">
                <p className="text-muted-foreground">No community products found matching "{searchQuery}"</p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredUserProducts.filter(p => p.seller !== 'You').map((product) => (
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
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => handleAddToCart(product, 'community')}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleBuyNow(product)}
                        disabled={walletBalance < product.cost}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Buy
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <UploadProductModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onProductAdded={handleProductAdded}
      />
    </DashboardLayout>
  );
};

export default Marketplace;
