"use client";

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initialProducts } from '@/data/products';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Skincare',
    inStock: true,
    featured: false,
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/auth/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session?.user) return;

    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      localStorage.setItem('products', JSON.stringify(initialProducts));
      setProducts(initialProducts);
    }
  }, [session]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProduct) {
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...formData,
              price: parseFloat(formData.price),
            }
          : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      toast.success('Product updated successfully!');
    } else {
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      toast.success('Product added successfully!');
    }

    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'Skincare',
      inStock: true,
      featured: false,
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      featured: product.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      toast.success('Product deleted successfully!');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>
                Manage your store products - add, edit, or remove items
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      image: '',
                      category: 'Skincare',
                      inStock: true,
                      featured: false,
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct
                      ? 'Update product information'
                      : 'Add a new product to your store'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Skincare">Skincare</SelectItem>
                          <SelectItem value="Makeup">Makeup</SelectItem>
                          <SelectItem value="Haircare">Haircare</SelectItem>
                          <SelectItem value="Fragrance">Fragrance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Use Unsplash or any image URL
                    </p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="inStock"
                        checked={formData.inStock}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, inStock: checked }))
                        }
                      />
                      <Label htmlFor="inStock">In Stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, featured: checked }))
                        }
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingProduct(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Skincare">Skincare</SelectItem>
                <SelectItem value="Makeup">Makeup</SelectItem>
                <SelectItem value="Haircare">Haircare</SelectItem>
                <SelectItem value="Fragrance">Fragrance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery || filterCategory !== 'all' ? 'No products found' : 'No products yet'}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.category} • ${product.price.toFixed(2)}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {product.featured && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          product.inStock
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
