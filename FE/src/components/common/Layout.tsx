
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  withFooter?: boolean;
}

export function Layout({ children, className, withFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={cn('flex-grow pt-20', className)}>
        {children}
      </main>
      {withFooter && <Footer />}
    </div>
  );
}
