import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  ShoppingBag,
  History,
  User,
  ChevronRight,
  ChevronLeft,
  Menu,
  Store,
  Award,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface CustomerSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function CustomerSidebar({ 
  isCollapsed, 
  onToggle, 
  isMobile, 
  isMobileOpen, 
  onMobileClose 
}: CustomerSidebarProps) {
  const location = useLocation();
  const { profile } = useAuth();

  const menuItems = useMemo(() => [
    {
      title: 'Home',
      icon: Home,
      href: '/customer/dashboard',
    },
    {
      title: 'Browse Restaurants',
      icon: Store,
      href: '/customer/restaurants',
    },
    {
      title: 'Order History',
      icon: History,
      href: '/customer/orders',
    },
    {
      title: 'Rewards',
      icon: Award,
      href: '/customer/rewards',
    },
    {
      title: 'Profile',
      icon: User,
      href: '/customer/profile',
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/customer/settings',
    },
  ], []);

  return (
    <aside className={cn(
      'fixed left-0 top-16 h-[calc(100vh-4rem)] glass border-r border-border overflow-hidden transition-all duration-300',
      isMobile 
        ? cn('z-50 w-64', isMobileOpen ? 'translate-x-0' : '-translate-x-full')
        : cn('z-40', isCollapsed ? 'w-16' : 'w-64')
    )}>
      <div className="h-full flex flex-col">
        {/* Toggle Button - Hidden on Mobile */}
        {!isMobile && (
          <div className={cn(
            'p-4 border-b border-border flex items-center',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold gradient-text-secondary mb-1">Customer Portal</h2>
                <p className="text-xs text-muted-foreground">Welcome, {profile?.full_name?.split(' ')[0] || 'Guest'}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="shrink-0 hover-glow-purple"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold gradient-text-secondary mb-1">Customer Portal</h2>
            <p className="text-xs text-muted-foreground">Welcome, {profile?.full_name?.split(' ')[0] || 'Guest'}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className={cn(
          'flex-1 overflow-y-auto p-4 space-y-1', 
          !isMobile && isCollapsed && 'px-2'
        )}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const showCollapsed = !isMobile && isCollapsed;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={isMobile ? onMobileClose : undefined}
                className={cn(
                  'flex items-center rounded-lg transition-all duration-200 group',
                  showCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3',
                  isActive
                    ? 'bg-secondary text-secondary-foreground shadow-lg glow-purple'
                    : 'hover:bg-muted text-foreground hover-glow-purple'
                )}
                title={showCollapsed ? item.title : undefined}
              >
                <div className={cn('flex items-center', showCollapsed ? '' : 'gap-3')}>
                  <Icon className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  )} />
                  {!showCollapsed && <span className="font-medium">{item.title}</span>}
                </div>
                {isActive && !showCollapsed && (
                  <ChevronRight className="w-4 h-4 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info Footer */}
        {profile && (isMobile || !isCollapsed) && (
          <div className="p-4 border-t border-border">
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center text-secondary-foreground font-bold">
                  {profile.full_name?.charAt(0) || 'G'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profile.full_name || 'Guest'}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
