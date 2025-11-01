"use client";

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, Store, Bell, Lock, Palette } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'BeautyHub',
    storeEmail: 'contact@beautyhub.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Beauty Street, New York, NY 10001',
    storeDescription: 'Your one-stop shop for premium beauty products',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewOrder: true,
    emailOnNewUser: false,
    emailOnLowStock: true,
    dailyReports: false,
  });

  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/auth/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session?.user) return;

    // Load settings from localStorage
    const savedStoreSettings = localStorage.getItem('storeSettings');
    if (savedStoreSettings) {
      setStoreSettings(JSON.parse(savedStoreSettings));
    }

    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }

    const savedMaintenanceMode = localStorage.getItem('maintenanceMode');
    if (savedMaintenanceMode) {
      setMaintenanceMode(JSON.parse(savedMaintenanceMode));
    }
  }, [session]);

  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStoreSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveStoreSettings = () => {
    localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
    toast.success('Store settings saved successfully!');
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    toast.success('Notification settings saved successfully!');
  };

  const handleMaintenanceModeToggle = (checked: boolean) => {
    setMaintenanceMode(checked);
    localStorage.setItem('maintenanceMode', JSON.stringify(checked));
    if (checked) {
      toast.success('Maintenance mode enabled');
    } else {
      toast.success('Maintenance mode disabled');
    }
  };

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
        {/* Store Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              <CardTitle>Store Information</CardTitle>
            </div>
            <CardDescription>
              Manage your store's basic information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                name="storeName"
                value={storeSettings.storeName}
                onChange={handleStoreSettingsChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email</Label>
                <Input
                  id="storeEmail"
                  name="storeEmail"
                  type="email"
                  value={storeSettings.storeEmail}
                  onChange={handleStoreSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone</Label>
                <Input
                  id="storePhone"
                  name="storePhone"
                  value={storeSettings.storePhone}
                  onChange={handleStoreSettingsChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeAddress">Address</Label>
              <Input
                id="storeAddress"
                name="storeAddress"
                value={storeSettings.storeAddress}
                onChange={handleStoreSettingsChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">Description</Label>
              <Textarea
                id="storeDescription"
                name="storeDescription"
                rows={3}
                value={storeSettings.storeDescription}
                onChange={handleStoreSettingsChange}
              />
            </div>

            <Button onClick={handleSaveStoreSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Store Settings
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>
              Configure when and how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailOnNewOrder">New Order Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive an email when a new order is placed
                </p>
              </div>
              <Switch
                id="emailOnNewOrder"
                checked={notificationSettings.emailOnNewOrder}
                onCheckedChange={(checked) =>
                  setNotificationSettings(prev => ({ ...prev, emailOnNewOrder: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailOnNewUser">New User Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive an email when a new user registers
                </p>
              </div>
              <Switch
                id="emailOnNewUser"
                checked={notificationSettings.emailOnNewUser}
                onCheckedChange={(checked) =>
                  setNotificationSettings(prev => ({ ...prev, emailOnNewUser: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailOnLowStock">Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts when products are running low
                </p>
              </div>
              <Switch
                id="emailOnLowStock"
                checked={notificationSettings.emailOnLowStock}
                onCheckedChange={(checked) =>
                  setNotificationSettings(prev => ({ ...prev, emailOnLowStock: checked }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dailyReports">Daily Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily summary reports via email
                </p>
              </div>
              <Switch
                id="dailyReports"
                checked={notificationSettings.dailyReports}
                onCheckedChange={(checked) =>
                  setNotificationSettings(prev => ({ ...prev, dailyReports: checked }))
                }
              />
            </div>

            <Button onClick={handleSaveNotifications}>
              <Save className="mr-2 h-4 w-4" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>System Settings</CardTitle>
            </div>
            <CardDescription>
              Advanced system configuration and maintenance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode" className="text-base">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the store for maintenance
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={maintenanceMode}
                onCheckedChange={handleMaintenanceModeToggle}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Admin Account</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {session?.user?.name}</p>
                  <p><span className="font-medium">Email:</span> {session?.user?.email}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-destructive">Danger Zone</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Irreversible and destructive actions
                </p>
                <Button variant="destructive" disabled>
                  Clear All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
