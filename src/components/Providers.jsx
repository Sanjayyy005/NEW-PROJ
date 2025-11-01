"use client";

import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <Toaster />
      </WishlistProvider>
    </CartProvider>
  );
}