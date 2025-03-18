
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { FadeIn, SlideIn } from '../ui/motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12',
        scrolled ? 'glass shadow-sm backdrop-blur-lg' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <SlideIn delay={100}>
          <Link to="/" className="flex items-center space-x-2">
            <div className="font-bold text-xl text-primary">Genius<span className="text-blue-500">Dev</span></div>
          </Link>
        </SlideIn>
        
        <div className="hidden md:flex items-center space-x-8">
          <SlideIn delay={150}>
            <div className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200 relative',
                    'hover:text-primary after:content-[""] after:absolute after:left-0 after:bottom-[-6px]',
                    'after:h-[2px] after:bg-primary after:transition-all after:duration-300',
                    location.pathname === link.path 
                      ? 'text-primary after:w-full' 
                      : 'text-gray-600 dark:text-gray-300 after:w-0 hover:after:w-full'
                  )}
                  style={{
                    transitionDelay: `${150 + index * 50}ms`
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </SlideIn>
        </div>
        
        <div className="flex items-center space-x-3">
          <FadeIn delay={300}>
            <ThemeToggle />
          </FadeIn>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="flex items-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <FadeIn delay={350} className="hidden md:block">
            <Link 
              to="/form"
              className="button-primary"
            >
              Get Started
            </Link>
          </FadeIn>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          'md:hidden absolute top-full left-0 w-full p-4 glass shadow-md',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <div className="flex flex-col space-y-4 p-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'px-4 py-2 rounded-md transition-colors duration-200',
                location.pathname === link.path 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/form"
            className="button-primary mt-2 w-full text-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
