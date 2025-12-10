import { useState } from 'react';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export const CartDropdown = () => {
  const { items, removeFromCart, clearCart, getTotalCost, itemCount } = useCart();
  const { balance, deductBalance } = useWallet();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: 'Cart is Empty',
        description: 'Add items to your cart before checking out',
        variant: 'destructive',
      });
      return;
    }

    const totalCost = getTotalCost();
    const success = deductBalance(totalCost);
    
    if (success) {
      toast({
        title: 'Checkout Successful! 🎉',
        description: `You've purchased ${items.length} items for $${totalCost.toFixed(2)}`,
      });
      clearCart();
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add items from the marketplace
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    {item.seller && (
                      <p className="text-xs text-muted-foreground">
                        by {item.seller}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">${item.cost}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator />
            <SheetFooter className="mt-4 flex-col gap-3">
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Your Balance:</span>
                  <span>${balance.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium">Total:</span>
                  <span className={`font-bold ${getTotalCost() > balance ? 'text-destructive' : 'text-primary'}`}>
                    ${getTotalCost().toFixed(2)}
                  </span>
                </div>
                {getTotalCost() > balance && (
                  <p className="text-xs text-destructive">
                    Insufficient balance. You need ${(getTotalCost() - balance).toFixed(2)} more.
                  </p>
                )}
              </div>
              <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1" onClick={clearCart}>
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button className="flex-1" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
