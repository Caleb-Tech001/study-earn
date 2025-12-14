import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  Trash2,
  Loader2,
  Download,
  Printer,
  Package,
  Building2,
  Truck,
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OrderReceipt } from '@/components/checkout/OrderReceipt';

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

type PaymentMethod = 'card' | 'bank_transfer' | 'pay_on_delivery';

interface PaymentInfo {
  method: PaymentMethod;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface OrderDetails {
  orderId: string;
  items: CartItem[];
  shipping: ShippingInfo;
  subtotal: number;
  tax: number;
  total: number;
  date: Date;
}

const STEPS: { key: CheckoutStep; label: string; icon: React.ElementType }[] = [
  { key: 'cart', label: 'Cart', icon: ShoppingCart },
  { key: 'shipping', label: 'Shipping', icon: MapPin },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'confirmation', label: 'Confirmation', icon: CheckCircle2 },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getTotalCost, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
  });

  const [payment, setPayment] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Auto-fill from user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone, phone_number, country')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setShipping(prev => ({
          ...prev,
          fullName: profile.full_name || '',
          email: profile.email || user.email || '',
          phone: profile.phone || profile.phone_number || '',
          country: profile.country || 'Nigeria',
        }));
      }
    };
    
    fetchProfile();
  }, [user]);

  const subtotal = getTotalCost();
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + tax;

  const stepIndex = STEPS.findIndex(s => s.key === currentStep);

  const goToStep = (step: CheckoutStep) => {
    const targetIndex = STEPS.findIndex(s => s.key === step);
    if (targetIndex <= stepIndex || validateCurrentStep()) {
      setCurrentStep(step);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'cart':
        if (items.length === 0) {
          toast({
            title: 'Cart is Empty',
            description: 'Add items to your cart before proceeding.',
            variant: 'destructive',
          });
          return false;
        }
        return true;
      case 'shipping':
        if (!shipping.fullName || !shipping.email || !shipping.phone || !shipping.address) {
          toast({
            title: 'Missing Information',
            description: 'Please fill in all required shipping fields.',
            variant: 'destructive',
          });
          return false;
        }
        return true;
      case 'payment':
        if (payment.method === 'card') {
          if (!payment.cardNumber || !payment.cardName || !payment.expiryDate || !payment.cvv) {
            toast({
              title: 'Missing Payment Info',
              description: 'Please fill in all card details.',
              variant: 'destructive',
            });
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    
    const currentIndex = STEPS.findIndex(s => s.key === currentStep);
    if (currentIndex < STEPS.length - 1) {
      if (currentStep === 'payment') {
        processPayment();
      } else {
        setCurrentStep(STEPS[currentIndex + 1].key);
      }
    }
  };

  const prevStep = () => {
    const currentIndex = STEPS.findIndex(s => s.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].key);
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderId = `SE-${Date.now().toString(36).toUpperCase()}`;
    
    setOrderDetails({
      orderId,
      items: [...items],
      shipping,
      subtotal,
      tax,
      total,
      date: new Date(),
    });
    
    clearCart();
    setIsProcessing(false);
    setCurrentStep('confirmation');
    
    toast({
      title: 'Order Placed Successfully! 🎉',
      description: `Your order #${orderId} has been confirmed.`,
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="mb-2 font-display text-4xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isActive = step.key === currentStep;
            const isCompleted = index < stepIndex;
            const Icon = step.icon;
            
            return (
              <div key={step.key} className="flex flex-1 items-center">
                <button
                  onClick={() => goToStep(step.key)}
                  disabled={index > stepIndex && currentStep !== 'confirmation'}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    isActive || isCompleted ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'border-primary bg-primary/10'
                        : 'border-muted'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Cart Step */}
        {currentStep === 'cart' && (
          <Card className="border-2 p-6">
            <h2 className="mb-6 font-display text-2xl font-bold">Your Cart</h2>
            
            {items.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">Your cart is empty</p>
                <Button className="mt-4" onClick={() => navigate('/learner/marketplace')}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <Badge variant="outline" className="mt-1">{item.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="w-24 text-right">
                      <p className="font-bold">${(item.cost * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.cost.toFixed(2)} each</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Separator className="my-6" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>VAT (7.5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Shipping Step */}
        {currentStep === 'shipping' && (
          <Card className="border-2 p-6">
            <h2 className="mb-6 font-display text-2xl font-bold">Shipping Information</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={shipping.fullName}
                  onChange={(e) => setShipping(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={shipping.email}
                  onChange={(e) => setShipping(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={shipping.phone}
                  onChange={(e) => setShipping(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={shipping.country}
                  onChange={(e) => setShipping(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="Nigeria"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={shipping.address}
                  onChange={(e) => setShipping(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street, Apartment 4B"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shipping.city}
                  onChange={(e) => setShipping(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Lagos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={shipping.state}
                  onChange={(e) => setShipping(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Lagos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Postal/ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={shipping.zipCode}
                  onChange={(e) => setShipping(prev => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="100001"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Payment Step */}
        {currentStep === 'payment' && (
          <Card className="border-2 p-6">
            <h2 className="mb-6 font-display text-2xl font-bold">Payment Details</h2>
            
            <div className="mb-6 rounded-lg bg-muted/50 p-4">
              <h3 className="mb-2 font-semibold">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>{items.reduce((acc, i) => acc + i.quantity, 0)} items</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>VAT</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <Label className="mb-3 block text-base font-semibold">Select Payment Method</Label>
              <RadioGroup
                value={payment.method}
                onValueChange={(value: PaymentMethod) => setPayment(prev => ({ ...prev, method: value }))}
                className="grid gap-3"
              >
                {/* Card Payment */}
                <div className={`flex items-center gap-4 rounded-lg border-2 p-4 transition-all cursor-pointer ${
                  payment.method === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex flex-1 cursor-pointer items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Card Payment</p>
                      <p className="text-sm text-muted-foreground">Pay with debit or credit card</p>
                    </div>
                  </Label>
                </div>

                {/* Bank Transfer */}
                <div className={`flex items-center gap-4 rounded-lg border-2 p-4 transition-all cursor-pointer ${
                  payment.method === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer" className="flex flex-1 cursor-pointer items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                      <Building2 className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">Pay via direct bank transfer</p>
                    </div>
                  </Label>
                </div>

                {/* Pay on Delivery */}
                <div className={`flex items-center gap-4 rounded-lg border-2 p-4 transition-all cursor-pointer ${
                  payment.method === 'pay_on_delivery' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="pay_on_delivery" id="pay_on_delivery" />
                  <Label htmlFor="pay_on_delivery" className="flex flex-1 cursor-pointer items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                      <Truck className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Pay on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Card Details - Only show if card is selected */}
            {payment.method === 'card' && (
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-semibold">Card Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={payment.cardNumber}
                    onChange={(e) => setPayment(prev => ({ 
                      ...prev, 
                      cardNumber: formatCardNumber(e.target.value) 
                    }))}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card *</Label>
                  <Input
                    id="cardName"
                    value={payment.cardName}
                    onChange={(e) => setPayment(prev => ({ ...prev, cardName: e.target.value }))}
                    placeholder="JOHN DOE"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      value={payment.expiryDate}
                      onChange={(e) => setPayment(prev => ({ 
                        ...prev, 
                        expiryDate: formatExpiryDate(e.target.value) 
                      }))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      type="password"
                      value={payment.cvv}
                      onChange={(e) => setPayment(prev => ({ 
                        ...prev, 
                        cvv: e.target.value.replace(/\D/g, '').slice(0, 4) 
                      }))}
                      placeholder="***"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer Instructions */}
            {payment.method === 'bank_transfer' && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <h3 className="mb-3 font-semibold text-blue-800 dark:text-blue-200">Bank Transfer Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-medium">First Bank Nigeria</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-medium">3012345678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-medium">StudyEarn Ltd</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Please transfer the exact amount and use your order ID as payment reference. 
                  Your order will be processed once payment is confirmed (within 24 hours).
                </p>
              </div>
            )}

            {/* Pay on Delivery Info */}
            {payment.method === 'pay_on_delivery' && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
                <h3 className="mb-2 font-semibold text-green-800 dark:text-green-200">Pay on Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  You will pay <span className="font-bold text-foreground">${total.toFixed(2)}</span> when 
                  your order is delivered. Please have the exact amount ready. We accept cash and POS payments.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Note: A verification call may be made before dispatch.
                </p>
              </div>
            )}

            <p className="mt-4 text-sm text-muted-foreground">
              🔒 Your payment information is encrypted and secure
            </p>
          </Card>
        )}

        {/* Confirmation Step */}
        {currentStep === 'confirmation' && orderDetails && (
          <Card className="border-2 p-6">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="font-display text-3xl font-bold text-green-600">Order Confirmed!</h2>
              <p className="mt-2 text-muted-foreground">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-muted/50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold">Order Number</span>
                <Badge variant="secondary" className="text-lg">{orderDetails.orderId}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Date</span>
                <span>{orderDetails.date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-4 font-semibold">Items Ordered</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold">${(item.cost * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT (7.5%)</span>
                <span>${orderDetails.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 font-semibold">Shipping To</h3>
              <div className="rounded-lg bg-muted/50 p-4 text-sm">
                <p className="font-medium">{orderDetails.shipping.fullName}</p>
                <p>{orderDetails.shipping.address}</p>
                <p>{orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.zipCode}</p>
                <p>{orderDetails.shipping.country}</p>
                <p className="mt-2">{orderDetails.shipping.email}</p>
                <p>{orderDetails.shipping.phone}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setShowReceipt(true)}>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button variant="outline" onClick={() => navigate('/learner/marketplace')}>
                Continue Shopping
              </Button>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        {currentStep !== 'confirmation' && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 'cart'}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={items.length === 0 || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : currentStep === 'payment' ? (
                <>
                  Place Order
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && orderDetails && (
        <OrderReceipt
          order={orderDetails}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </DashboardLayout>
  );
};

export default Checkout;
