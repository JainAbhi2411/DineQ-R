import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomerSidebar from './CustomerSidebar';
import { cn } from '@/lib/utils';

interface CustomerLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
}

export default function CustomerLayout({ 
  children, 
  title,
  showHeader = true
}: CustomerLayoutProps) {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Mobile Overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <CustomerSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobile={isMobile}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      
      <main className={cn(
        'flex-1 bg-gradient-to-br from-background via-background to-muted transition-all duration-300 relative overflow-hidden',
        !isMobile && (isSidebarCollapsed ? 'ml-16' : 'ml-64')
      )}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--secondary)/0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--primary)/0.08),transparent_50%)] pointer-events-none" />

        {/* Mobile Header with Menu Button */}
        {isMobile && showHeader && (
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="p-3 flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              {title && (
                <h1 className="text-lg font-bold gradient-text-secondary truncate">{title}</h1>
              )}
            </div>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && showHeader && title && (
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="p-4">
              <h1 className="text-2xl font-bold gradient-text-secondary">{title}</h1>
            </div>
          </div>
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
