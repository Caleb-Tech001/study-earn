import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: string;
  seller?: string;
  type: 'reward' | 'digital' | 'community';
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalCost: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (item: CartItem) => {
    const exists = items.find((i) => i.id === item.id);
    if (exists) {
      toast({
        title: 'Already in Cart',
        description: `${item.title} is already in your cart`,
      });
      return;
    }
    setItems((prev) => [...prev, item]);
    toast({
      title: 'Added to Cart 🛒',
      description: `${item.title} has been added to your cart`,
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: 'Removed from Cart',
      description: 'Item has been removed from your cart',
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalCost = () => {
    return items.reduce((total, item) => total + item.cost, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCost,
        itemCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
