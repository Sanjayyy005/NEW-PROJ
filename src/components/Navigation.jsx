"use client";

import Link from 'next/link';
import { authClient, useSession } from '@/lib/auth-client';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Navigation() {
  const { data: session, isPending, refetch } = useSession();
  const { cartCount } = useCart();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error('Failed to logout');
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    }
  };

  const isAuthenticated = !!session?.user;

  return (
    <nav className="border-b bg-white dark:bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            BeautyHub
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/services" className="hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/cart" className="relative">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {!isPending && !isAuthenticated && (
              <Link href="/auth/signup">
                <Button className="bg-white text-black border border-black hover:bg-black hover:text-white dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black">
                  Sign Up
                </Button>
              </Link>
            )}

            {!isPending && isAuthenticated && (
              <>
                <Link href="/admin">
                  <Button variant="ghost" size="icon" title="Admin Panel">
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </Link>

                <Button variant="ghost" size="icon" onClick={handleSignOut} title="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}