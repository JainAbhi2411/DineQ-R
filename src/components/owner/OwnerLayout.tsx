import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OwnerSidebar from './OwnerSidebar';
import { cn } from '@/lib/utils';

interface OwnerLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
}

export default function OwnerLayout({ 
  children, 
  showBackButton = false, 
  backTo = '/owner/dashboard',
  title 
}: OwnerLayoutProps) {
  const location = useLocation();
  const isDashboard = location.pathname === '/owner/dashboard';
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

      <OwnerSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobile={isMobile}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      
      <main className={cn(
        'flex-1 bg-gradient-to-br from-background via-background to-muted transition-all duration-300',
        !isMobile && (isSidebarCollapsed ? 'ml-16' : 'ml-64')
      )}>
        {/* Mobile Header with Menu Button */}
        {isMobile && (
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
                <h1 className="text-lg font-bold gradient-text-primary truncate">{title}</h1>
              )}
            </div>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (showBackButton || (!isDashboard && !title)) && (
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="p-4 flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="morph-button">
                <Link to={backTo} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </Button>
              {title && (
                <h1 className="text-2xl font-bold gradient-text-primary">{title}</h1>
              )}
            </div>
          </div>
        )}
        
        {children}
      </main>
    </div>
  );
}
