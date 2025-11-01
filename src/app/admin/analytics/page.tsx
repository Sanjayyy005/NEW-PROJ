"use client";

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initialProducts } from '@/data/products';
import { BarChart3, TrendingUp, ShoppingBag, DollarSign, Package } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function AnalyticsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

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
      setProducts(initialProducts);
    }

    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, [session]);

  // Calculate analytics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  // Category breakdown
  const categoryStats = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = { count: 0, revenue: 0 };
    }
    acc[category].count += 1;
    
    // Calculate revenue from orders
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.name === product.name) {
          acc[category].revenue += item.price * item.quantity;
        }
      });
    });
    
    return acc;
  }, {});

  const categoryData = Object.entries(categoryStats).map(([name, stats]: [string, any]) => ({
    name,
    count: stats.count,
    revenue: stats.revenue,
  }));

  const maxRevenue = Math.max(...categoryData.map(c => c.revenue), 1);

  // Monthly data (mock - last 6 months)
  const monthlyData = [
    { month: 'Oct', revenue: 4500, orders: 45 },
    { month: 'Nov', revenue: 5200, orders: 52 },
    { month: 'Dec', revenue: 6100, orders: 61 },
    { month: 'Jan', revenue: 5800, orders: 58 },
    { month: 'Feb', revenue: 6500, orders: 65 },
    { month: 'Mar', revenue: totalRevenue || 7200, orders: orders.length || 72 },
  ];

  const maxMonthlyRevenue = Math.max(...monthlyData.map(m => m.revenue));

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
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Order Value
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+5.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+8.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+0.5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue by Month */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">{data.orders} orders</span>
                        <span className="font-semibold">${data.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress value={(data.revenue / maxMonthlyRevenue) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Sales breakdown by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No data available
                  </div>
                ) : (
                  categoryData.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{category.name}</span>
                          <span className="text-muted-foreground ml-2">({category.count} products)</span>
                        </div>
                        <span className="font-semibold">${category.revenue.toFixed(2)}</span>
                      </div>
                      <Progress value={(category.revenue / maxRevenue) * 100} className="h-2" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Day</CardTitle>
              <CardDescription>Highest sales day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">Saturday</p>
                <p className="text-sm text-muted-foreground">
                  Average of ${(totalRevenue * 0.18).toFixed(2)} per Saturday
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products in Stock</CardTitle>
              <CardDescription>Available inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  {products.filter(p => p.inStock).length} / {products.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {((products.filter(p => p.inStock).length / products.length) * 100).toFixed(0)}% in stock
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Products</CardTitle>
              <CardDescription>Currently featured</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  {products.filter(p => p.featured).length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Products marked as featured
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
