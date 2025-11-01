"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success('Added to cart');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      toast.success('Added to wishlist');
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
          {product.featured && (
            <Badge className="absolute top-2 right-2">Featured</Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white z-10"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-5 w-5 ${
                isInWishlist(product.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600'
              }`}
            />
          </Button>
        </div>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2">
            {product.category}
          </Badge>
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {product.description}
          </p>
          <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
