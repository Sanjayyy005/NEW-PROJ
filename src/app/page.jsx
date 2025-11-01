"use client";

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { initialProducts } from '@/data/products';
import Link from 'next/link';
import { Sparkles, Package, Truck, Shield } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always sync with initialProducts to ensure new products are included
    const storedProducts = localStorage.getItem('products');
    let currentProducts = storedProducts ? JSON.parse(storedProducts) : [];
    
    // Merge initialProducts with stored products, prioritizing initialProducts for new/updated items
    const productMap = new Map();
    
    // First add all stored products
    currentProducts.forEach(p => productMap.set(p.id, p));
    
    // Then add/update with initialProducts (this ensures new products and updates are included)
    initialProducts.forEach(p => productMap.set(p.id, p));
    
    const mergedProducts = Array.from(productMap.values());
    localStorage.setItem('products', JSON.stringify(mergedProducts));
    setProducts(mergedProducts);
    setLoading(false);
  }, []);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative h-[600px] bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Discover Your Natural Beauty
              </h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Premium beauty products curated just for you. Elevate your skincare and makeup routine.
              </p>
              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg" className="text-lg">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Only the finest ingredients
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Wide Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Hundreds of products to choose from
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Free delivery on orders over $50
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">
                  100% secure transactions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground">
                Discover our most popular beauty essentials
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" variant="outline">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Join Our Beauty Community
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get exclusive offers, beauty tips, and early access to new products
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
