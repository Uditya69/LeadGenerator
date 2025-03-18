import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { cn } from '@/lib/utils';
import { FadeIn } from '../ui/motion';
import { AUTH_CONFIG } from '@/lib/config';
import { toast } from '@/components/ui/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowMobileMenu(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);
  
  const handleSignOut = () => {
    // Clear the auth token from localStorage
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    
    // Show success message
    toast({
      title: 'Signed out successfully',
      description: 'You have been signed out of your account.',
    });
    
    // Redirect to login page
    navigate('/admin/login');
  };
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/admin/leads', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar (desktop) */}
      <aside 
        className={cn(
          'bg-gray-900 text-white h-screen transition-all duration-300 fixed lg:sticky top-0 lg:flex',
          collapsed ? 'w-20' : 'w-64',
          mobile ? 'hidden' : 'flex flex-col'
        )}
      >
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <Link to="/admin/dashboard" className="text-xl font-bold">
              Admin Portal
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            {collapsed ? <Menu size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-md transition-colors',
                  location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className={cn(
              'flex items-center gap-3 px-3 py-3 w-full rounded-md',
              'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors'
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
      
      {/* Main content area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="lg:hidden font-bold">Admin Portal</div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <ThemeToggle />
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-medium">AD</span>
                </div>
                <span className="hidden md:inline-block text-sm font-medium">Admin User</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden">
            <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4">
              <div className="flex items-center justify-between mb-8">
                <Link to="/admin/dashboard" className="text-xl font-bold">
                  Admin Portal
                </Link>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-md transition-colors',
                      location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="mt-8 pt-4 border-t border-gray-800">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-3 w-full rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Content area */}
        <FadeIn>
          <div className="flex-1 p-6">{children}</div>
        </FadeIn>
      </main>
    </div>
  );
}
