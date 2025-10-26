"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { initialProducts } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const products = storedProducts ? JSON.parse(storedProducts) : initialProducts;
    const foundProduct = products.find((p) => p.id === params.id);
    setProduct(foundProduct || null);
    setLoading(false);
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/products')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.featured && (
                <Badge className="absolute top-4 right-4">Featured</Badge>
              )}
            </div>

            {/* Product Details */}
            <div>
              <Badge variant="secondary" className="mb-4">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mb-6">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="mb-8 p-6 bg-secondary/30 rounded-lg">
                <h3 className="font-semibold mb-4">Product Details</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Product ID:</span>
                    <span className="font-medium">{product.id}</span>
                  </li>
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
