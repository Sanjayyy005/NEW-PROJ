"use client";

import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
    });
    clearWishlist();
  };

  if (wishlist.length === 0) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-20">
              <Heart className="h-24 w-24 text-muted-foreground mb-6" />
              <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
              <p className="text-muted-foreground mb-8">
                Add products you love to your wishlist
              </p>
              <Link href="/products">
                <Button size="lg">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={clearWishlist}
              >
                Clear Wishlist
              </Button>
              <Button onClick={handleMoveAllToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Move All to Cart
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <Link href={`/products/${item.id}`}>
                  <div className="relative h-64 overflow-hidden cursor-pointer">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {item.category}
                  </Badge>
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  <p className="text-xl font-bold text-primary mb-4">
                    ${item.price.toFixed(2)}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
