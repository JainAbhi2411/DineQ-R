import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Table2, 
  ChevronRight,
  Store,
  ChevronLeft,
  Menu,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Button } from '@/components/ui/button';

interface OwnerSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function OwnerSidebar({ 
  isCollapsed, 
  onToggle, 
  isMobile, 
  isMobileOpen, 
  onMobileClose 
}: OwnerSidebarProps) {
  const location = useLocation();
  const { restaurantId, loading } = useRestaurant();

  const menuItems = useMemo(() => [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/owner/dashboard',
      requiresRestaurant: false,
    },
    {
      title: 'Restaurants',
      icon: Store,
      href: '/owner/restaurants',
      requiresRestaurant: false,
    },
    {
      title: 'Menu Management',
      icon: UtensilsCrossed,
      href: restaurantId ? `/owner/menu/${restaurantId}` : '#',
      requiresRestaurant: true,
    },
    {
      title: 'Orders',
      icon: ShoppingBag,
      href: restaurantId ? `/owner/orders/${restaurantId}` : '#',
      requiresRestaurant: true,
    },
    {
      title: 'Tables',
      icon: Table2,
      href: restaurantId ? `/owner/tables/${restaurantId}` : '#',
      requiresRestaurant: true,
    },
    {
      title: 'Staff Management',
      icon: Users,
      href: restaurantId ? `/owner/staff/${restaurantId}` : '#',
      requiresRestaurant: true,
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: restaurantId ? `/owner/analytics/${restaurantId}` : '#',
      requiresRestaurant: true,
    },
    {
      title: 'Reviews',
      icon: MessageSquare,
      href: restaurantId ? `/owner/reviews/${restaurantId}` : '#',
      requiresRestaurant: true,
    },
    {
      title: 'Promotions',
      icon: Tag,
      href: restaurantId ? `/owner/promotions/${restaurantId}` : '#',
      requiresRestaurant: true,
    },
    {
      title: 'Settings',
      icon: Settings,
      href: restaurantId ? `/owner/settings/${restaurantId}` : '#',
      requiresRestaurant: true,
    },
  ], [restaurantId]);

  if (loading) {
    return (
      <aside className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] glass border-r border-border overflow-hidden transition-all duration-300',
        isMobile 
          ? cn('z-50 w-64', isMobileOpen ? 'translate-x-0' : '-translate-x-full')
          : cn('z-40', isCollapsed ? 'w-16' : 'w-64')
      )}>
        <div className="p-4 flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      </aside>
    );
  }

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
                <h2 className="text-lg font-bold gradient-text-primary mb-1">Restaurant Owner</h2>
                <p className="text-xs text-muted-foreground">Manage your restaurant</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="shrink-0 hover-glow-orange"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold gradient-text-primary mb-1">Restaurant Owner</h2>
            <p className="text-xs text-muted-foreground">Manage your restaurant</p>
          </div>
        )}

        {/* Navigation */}
        <nav className={cn(
          'flex-1 overflow-y-auto p-4 space-y-1', 
          !isMobile && isCollapsed && 'px-2'
        )}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
                           (item.requiresRestaurant && restaurantId && location.pathname.includes(item.href.split('/')[2]));
            const isDisabled = item.requiresRestaurant && !restaurantId;
            const showCollapsed = !isMobile && isCollapsed;

            if (isDisabled) {
              return (
                <div
                  key={item.title}
                  className={cn(
                    'flex items-center rounded-lg opacity-50 cursor-not-allowed transition-all duration-200',
                    showCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'
                  )}
                  title={showCollapsed ? item.title : undefined}
                >
                  <div className={cn('flex items-center', showCollapsed ? '' : 'gap-3')}>
                    <Icon className="w-5 h-5" />
                    {!showCollapsed && <span className="font-medium">{item.title}</span>}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={isMobile ? onMobileClose : undefined}
                className={cn(
                  'flex items-center rounded-lg transition-all duration-200 group',
                  showCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg glow-orange'
                    : 'hover:bg-muted text-foreground hover-glow-orange'
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

        {/* No Restaurant Message */}
        {!restaurantId && (isMobile || !isCollapsed) && (
          <div className="p-4 border-t border-border">
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-2">No restaurant found</p>
              <Link 
                to="/owner/restaurants/new"
                onClick={isMobile ? onMobileClose : undefined}
                className="text-xs text-primary hover:underline font-medium"
              >
                Create your first restaurant →
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
