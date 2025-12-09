import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, QrCode, ShoppingCart, Receipt, Store, User, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, profile, loading } = useAuth();

  // Show loading spinner while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent glow-orange"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-primary opacity-20"></div>
        </div>
      </div>
    );
  }

  // Redirect authenticated users immediately without rendering homepage
  if (user && profile) {
    if (profile.role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }
    if (profile.role === 'customer') {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-primary-glow rounded-full mb-6 animate-float glow-orange">
            <UtensilsCrossed className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-6xl font-bold mb-4 gradient-text-primary animate-fade-in-up animation-delay-200">
            Welcome to DineQR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-400 font-light">
            Smart Restaurant Menu System - Connecting restaurants and customers through digital innovation
          </p>
          <div className="flex justify-center gap-3 mt-6 animate-fade-in-up animation-delay-600">
            <Zap className="w-6 h-6 text-primary animate-pulse" />
            <Sparkles className="w-5 h-5 text-secondary animate-pulse animation-delay-200" />
            <Zap className="w-6 h-6 text-primary animate-pulse animation-delay-400" />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-16 animate-fade-in-up animation-delay-800">
          <Button size="lg" asChild className="morph-button hover-glow-orange text-lg px-8 py-6 rounded-full">
            <Link to="/register">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="morph-button hover-glow-purple text-lg px-8 py-6 rounded-full border-2">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8 mb-16">
          <Card className="glass hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-in-left animation-delay-1000 border-2 border-border hover:border-primary/50 overflow-hidden group">
            <div className="scan-line" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold">For Restaurant Owners</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3 animate-fade-in animation-delay-1200 group/item hover:text-foreground transition-colors">
                  <span className="text-primary mt-1 text-xl">⚡</span>
                  <span>Manage your restaurant profile and menu items</span>
                </li>
                <li className="flex items-start gap-3 animate-fade-in animation-delay-1300 group/item hover:text-foreground transition-colors">
                  <span className="text-primary mt-1 text-xl">⚡</span>
                  <span>Generate unique QR codes for each table</span>
                </li>
                <li className="flex items-start gap-3 animate-fade-in animation-delay-1400 group/item hover:text-foreground transition-colors">
                  <span className="text-primary mt-1 text-xl">⚡</span>
                  <span>Receive and manage orders in real-time</span>
                </li>
                <li className="flex items-start gap-3 animate-fade-in animation-delay-1500 group/item hover:text-foreground transition-colors">
                  <span className="text-primary mt-1 text-xl">⚡</span>
                  <span>Track order status and generate bills</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-in-right animation-delay-1000 border-2 border-border hover:border-secondary/50 overflow-hidden group">
            <div className="scan-line" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-7 h-7 text-secondary-foreground" />
                </div>
                <h3 className="text-3xl font-bold">For Customers</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3 animate-fade-in animation-delay-1200 group/item hover:text-foreground transition-colors">
                  <span className="text-secondary mt-1 text-xl">✨</span>
                  <span>Scan QR codes to view restaurant menus</span>
                </li>
                <li className="flex items-start gap-3 animate-fade-in animation-delay-1300 group/item hover:text-foreground transition-colors">
                  <span className="text-secondary mt-1 text-xl">✨</span>
                  <span>Browse menu items with images and descriptions</span>
                </li>
                <li className="flex items-start gap-3 animate-fade-in animation-delay-1400 group/item hover:text-foreground transition-colors">
                  <span className="text-secondary mt-1 text-xl">✨</span>
                  <span>Place orders directly from your phone</span>
                </li>
                <li className="flex items-start gap-3 animate-fade-in animation-delay-1500 group/item hover:text-foreground transition-colors">
                  <span className="text-secondary mt-1 text-xl">✨</span>
                  <span>Track order status and view order history</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-6">
          <Card className="glass text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fade-in-up animation-delay-1600 cursor-pointer group border-2 border-border hover:border-primary/50">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary group-hover:to-primary-glow transition-all duration-300 group-hover:rotate-12">
              <QrCode className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h4 className="font-semibold mb-2 text-lg">QR Code System</h4>
            <p className="text-sm text-muted-foreground">Unique codes for each table</p>
          </Card>

          <Card className="glass text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fade-in-up animation-delay-1700 cursor-pointer group border-2 border-border hover:border-secondary/50">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-secondary group-hover:to-secondary-glow transition-all duration-300 group-hover:rotate-12">
              <UtensilsCrossed className="w-8 h-8 text-secondary group-hover:text-secondary-foreground transition-colors" />
            </div>
            <h4 className="font-semibold mb-2 text-lg">Digital Menu</h4>
            <p className="text-sm text-muted-foreground">Beautiful, easy-to-browse menus</p>
          </Card>

          <Card className="glass text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fade-in-up animation-delay-1800 cursor-pointer group border-2 border-border hover:border-primary/50">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary group-hover:to-primary-glow transition-all duration-300 group-hover:rotate-12">
              <ShoppingCart className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h4 className="font-semibold mb-2 text-lg">Easy Ordering</h4>
            <p className="text-sm text-muted-foreground">Place orders with a few taps</p>
          </Card>

          <Card className="glass text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fade-in-up animation-delay-1900 cursor-pointer group border-2 border-border hover:border-secondary/50">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-secondary group-hover:to-secondary-glow transition-all duration-300 group-hover:rotate-12">
              <Receipt className="w-8 h-8 text-secondary group-hover:text-secondary-foreground transition-colors" />
            </div>
            <h4 className="font-semibold mb-2 text-lg">Payment Integration</h4>
            <p className="text-sm text-muted-foreground">Secure online payments</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
