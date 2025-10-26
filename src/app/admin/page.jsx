"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { initialProducts } from '@/data/products';
import { Edit, Trash2, Plus, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
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

export default function AdminPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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
    if (!isAuthenticated || !isAdmin) {
      router.push('/auth/login');
      return;
    }

    // Load products
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      localStorage.setItem('products', JSON.stringify(initialProducts));
      setProducts(initialProducts);
    }

    // Load orders
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProduct) {
      // Update existing product
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
      setSuccessMessage('Product updated successfully!');
    } else {
      // Add new product
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setSuccessMessage('Product added successfully!');
    }

    // Reset form
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

    setTimeout(() => setSuccessMessage(''), 3000);
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
      setSuccessMessage('Product deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <>
      <Navigation />
      <main className="py-16 bg-secondary/30 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>

          {successMessage && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products.filter((p) => p.inStock).length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Product Management</CardTitle>
                      <CardDescription>
                        Add, edit, or remove products from your store
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
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
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
                          <p className="text-sm text-muted-foreground">
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>View and manage customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No orders yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString()} at{' '}
                                {new Date(order.date).toLocaleTimeString()}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded">
                              {order.status}
                            </span>
                          </div>
                          <div className="space-y-2 mb-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between text-sm"
                              >
                                <span>
                                  {item.name} × {item.quantity}
                                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                <p className="font-medium">{order.shippingInfo.fullName}</p>
                                <p className="text-muted-foreground">
                                  {order.shippingInfo.email}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-xl font-bold text-primary">
                                  ${order.total.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
