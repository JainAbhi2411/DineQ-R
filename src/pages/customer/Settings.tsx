import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  Trash2, 
  LogOut,
  Shield,
  Mail,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CustomerLayout from '@/components/customer/CustomerLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Settings() {
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check current theme
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    toast({
      title: 'Account Deletion',
      description: 'This feature will be available soon. Please contact support to delete your account.',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your notification preferences have been updated',
    });
  };

  return (
    <CustomerLayout title="Settings">
      <div className="max-w-4xl mx-auto px-3 xl:px-6 py-4 xl:py-8">
        <div className="mb-6 animate-fade-in-up">
          <p className="text-muted-foreground text-sm xl:text-base">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card className="glass border-2 border-border animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                <CardTitle className="text-lg xl:text-xl">Appearance</CardTitle>
              </div>
              <CardDescription className="text-sm xl:text-base">
                Customize how the app looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm xl:text-base">Dark Mode</Label>
                  <p className="text-xs xl:text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="glass border-2 border-border animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <CardTitle className="text-lg xl:text-xl">Notifications</CardTitle>
              </div>
              <CardDescription className="text-sm xl:text-base">
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-sm xl:text-base">Email Notifications</Label>
                    <p className="text-xs xl:text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-sm xl:text-base">Push Notifications</Label>
                    <p className="text-xs xl:text-sm text-muted-foreground">
                      Receive push notifications on your device
                    </p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm xl:text-base">Order Updates</Label>
                  <p className="text-xs xl:text-sm text-muted-foreground">
                    Get notified about order status changes
                  </p>
                </div>
                <Switch
                  checked={orderUpdates}
                  onCheckedChange={setOrderUpdates}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm xl:text-base">Promotions & Offers</Label>
                  <p className="text-xs xl:text-sm text-muted-foreground">
                    Receive special offers and promotions
                  </p>
                </div>
                <Switch
                  checked={promotions}
                  onCheckedChange={setPromotions}
                />
              </div>

              <div className="pt-2">
                <Button onClick={handleSaveNotifications} className="w-full xl:w-auto">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="glass border-2 border-border animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <CardTitle className="text-lg xl:text-xl">Privacy & Security</CardTitle>
              </div>
              <CardDescription className="text-sm xl:text-base">
                Manage your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Globe className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="glass border-2 border-border animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="text-lg xl:text-xl">Account Actions</CardTitle>
              <CardDescription className="text-sm xl:text-base">
                Manage your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="lg"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start" 
                    size="lg"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}
