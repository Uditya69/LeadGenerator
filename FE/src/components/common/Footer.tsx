
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';
import { FadeIn, SlideUp } from '../ui/motion';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const services = [
    { name: 'Web Development', path: '/services/web-development' },
    { name: 'Mobile Apps', path: '/services/mobile-apps' },
    { name: 'Custom Software', path: '/services/custom-software' },
    { name: 'AI Solutions', path: '/services/ai-solutions' },
  ];
  
  const company = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];
  
  const legal = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];
  
  const socials = [
    { name: 'Github', icon: Github, path: 'https://github.com' },
    { name: 'Twitter', icon: Twitter, path: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, path: 'https://linkedin.com' },
  ];
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <SlideUp>
              <Link to="/" className="inline-block">
                <div className="font-bold text-xl text-primary mb-4">Genius<span className="text-blue-500">Dev</span></div>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                We build innovative software solutions for businesses of all sizes, leveraging the latest technologies to solve complex problems.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Mail size={16} className="mr-2" />
                  <span>contact@geniusdev.com</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Phone size={16} className="mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <MapPin size={16} className="mr-2" />
                  <span>123 Innovation St, Tech City</span>
                </div>
              </div>
            </SlideUp>
          </div>
          
          <div>
            <SlideUp delay={100}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Services</h3>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link to={service.path} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </SlideUp>
          </div>
          
          <div>
            <SlideUp delay={150}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                {company.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </SlideUp>
          </div>
          
          <div>
            <SlideUp delay={200}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-2">
                {legal.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {socials.map((social) => (
                    <a 
                      key={social.name}
                      href={social.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                      aria-label={social.name}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </SlideUp>
          </div>
        </div>
        
        <FadeIn delay={300}>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>© {currentYear} GeniusDev. All rights reserved.</p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
