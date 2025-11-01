"use client";

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Eye, Package, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export default function OrdersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/auth/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session?.user) return;

    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingInfo.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
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
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery || filterStatus !== 'all' ? 'No orders found' : 'No orders yet'}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-lg">Order #{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {order.shippingInfo.email}
                        </p>
                        <p className="text-xs">
                          {new Date(order.date).toLocaleDateString()} at{' '}
                          {new Date(order.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-primary">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details #{order.id}</DialogTitle>
                            <DialogDescription>
                              Complete order information and items
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Status */}
                            <div>
                              <h3 className="font-semibold mb-2">Order Status</h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>

                            <Separator />

                            {/* Customer Information */}
                            <div>
                              <h3 className="font-semibold mb-2">Customer Information</h3>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Name:</span> {order.shippingInfo.fullName}</p>
                                <p><span className="font-medium">Email:</span> {order.shippingInfo.email}</p>
                                <p><span className="font-medium">Phone:</span> {order.shippingInfo.phone}</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Shipping Address */}
                            <div>
                              <h3 className="font-semibold mb-2">Shipping Address</h3>
                              <div className="text-sm">
                                <p>{order.shippingInfo.address}</p>
                                <p>
                                  {order.shippingInfo.city}, {order.shippingInfo.state}{' '}
                                  {order.shippingInfo.zipCode}
                                </p>
                              </div>
                            </div>

                            <Separator />

                            {/* Order Items */}
                            <div>
                              <h3 className="font-semibold mb-3">Order Items</h3>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        ${item.price.toFixed(2)} × {item.quantity}
                                      </p>
                                    </div>
                                    <p className="font-semibold">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Order Total */}
                            <div className="flex items-center justify-between text-lg">
                              <span className="font-semibold">Order Total</span>
                              <span className="text-2xl font-bold text-primary">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>

                            <Separator />

                            {/* Order Date */}
                            <div className="text-sm text-muted-foreground">
                              <p>
                                <span className="font-medium">Order Date:</span>{' '}
                                {new Date(order.date).toLocaleDateString()} at{' '}
                                {new Date(order.date).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm font-medium mb-2">Items:</p>
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <p key={item.id} className="text-sm text-muted-foreground">
                          • {item.name} ({item.quantity}x)
                        </p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">
                          • And {order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
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
