"use client";

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { initialProducts } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

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
    setFilteredProducts(mergedProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, categoryFilter, sortBy]);

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Our Products</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our curated collection of premium beauty products
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={categoryFilter === category ? 'default' : 'outline'}
                      onClick={() => setCategoryFilter(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No products found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
