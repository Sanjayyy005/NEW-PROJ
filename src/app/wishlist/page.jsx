"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardStats } from "@/components/admin/DashboardStats";
import RecentOrders from "@/components/admin/RecentOrders";
import TopProducts from "@/components/admin/TopProducts";
import { toast } from "sonner";

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

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: number;
  items: OrderItem[];
  total: number;
  status: string;
  shippingInfo: {
    fullName: string;
    email: string;
  };
}

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: "admin" | "customer";
}

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no session
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth/login");
    }
  }, [session, isPending, router]);

  // Load data
  useEffect(() => {
    if (!session?.user) return;

    const loadData = async () => {
      try {
        // Products
        const storedProducts = localStorage.getItem("products");
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts) as Product[]);
        } else {
          // Initialize with default products if none exist
          const defaultProducts: Product[] = [
            {
              id: "1",
              name: "Radiant Glow Serum",
              description: "Brightening serum with vitamin C",
              price: 45.99,
              image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
              category: "Skincare",
              inStock: true,
              featured: true,
              stock: 50,
            },
            {
              id: "2",
              name: "Luxury Lipstick Set",
              description: "5-piece premium lipstick collection",
              price: 89.99,
              image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
              category: "Makeup",
              inStock: true,
              featured: true,
              stock: 30,
            },
          ];
          localStorage.setItem("products", JSON.stringify(defaultProducts));
          setProducts(defaultProducts);
        }

        // Orders
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders) as Order[]);
        } else {
          setOrders([]);
        }

        // Users
        const token = localStorage.getItem("bearer_token");
        if (token) {
          const response = await fetch("/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data: User[] = await response.json();
            setUsers(data);
          } else {
            setUsers([]);
          }
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  if (isPending || loading) {
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
        <DashboardStats
          totalProducts={products.length}
          totalOrders={orders.length}
          totalUsers={users.length}
          totalRevenue={totalRevenue}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentOrders orders={orders} />
          <TopProducts products={products} />
        </div>
      </div>
    </AdminLayout>
  );
}