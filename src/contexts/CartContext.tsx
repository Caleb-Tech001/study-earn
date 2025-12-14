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
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCost: () => number;
  getTotalItems: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const existingIndex = items.findIndex((i) => i.id === item.id);
    
    if (existingIndex !== -1) {
      // Update quantity if item exists
      setItems((prev) => 
        prev.map((i, index) => 
          index === existingIndex 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
      toast({
        title: 'Cart Updated 🛒',
        description: `Added ${quantity} more of ${item.title} to your cart`,
      });
    } else {
      // Add new item
      setItems((prev) => [...prev, { ...item, quantity }]);
      toast({
        title: 'Added to Cart 🛒',
        description: `${item.title} has been added to your cart`,
      });
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: 'Removed from Cart',
      description: 'Item has been removed from your cart',
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalCost = () => {
    return items.reduce((total, item) => total + (item.cost * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalCost,
        getTotalItems,
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
