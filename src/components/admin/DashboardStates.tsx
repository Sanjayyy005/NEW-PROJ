"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsProps {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export function DashboardStats({ totalProducts, totalOrders, totalUsers, totalRevenue }: StatsProps) {
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      trend: '+8.2%',
      trendUp: true,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      trend: '+3.1%',
      trendUp: true,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      trend: '+5.7%',
      trendUp: true,
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendIcon className={`h-3 w-3 mr-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`} />
                <span className={stat.trendUp ? 'text-green-600' : 'text-red-600'}>
                  {stat.trend}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default DashboardStats;