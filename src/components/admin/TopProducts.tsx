"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  stock: number;
}

interface TopProductsProps {
  products: Product[];
}

export default function TopProducts({ products }: TopProductsProps) {
  // Mock sales data - in real app, this would come from actual sales data
  const topProducts = products.slice(0, 5).map((product, index) => ({
    ...product,
    sales: Math.floor(Math.random() * 100) + 20,
    maxSales: 150,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best selling products this month</CardDescription>
      </CardHeader>
      <CardContent>
        {topProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No products yet
          </div>
        ) : (
          <div className="space-y-6">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                  <Progress 
                    value={(product.sales / product.maxSales) * 100} 
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-right">
                  <p className="font-semibold">{product.sales}</p>
                  <p className="text-xs text-muted-foreground">sales</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}