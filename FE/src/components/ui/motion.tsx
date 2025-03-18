import { useRef, useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

interface StaggerProps {
  children: ReactNode[];
  className?: string;
  delay?: number;
  initialDelay?: number;
}

export const FadeIn = ({ children, className, delay = 0 }: MotionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={cn(
        'transition-opacity duration-700 ease-in-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
};

export const SlideUp = ({ children, className, delay = 0 }: MotionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8',
        className
      )}
    >
      {children}
    </div>
  );
};

export const SlideIn = ({ children, className, delay = 0 }: MotionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible 
          ? 'opacity-100 transform translate-x-0' 
          : 'opacity-0 transform -translate-x-8',
        className
      )}
    >
      {children}
    </div>
  );
};

export const ScaleIn = ({ children, className, delay = 0 }: MotionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible 
          ? 'opacity-100 transform scale-100' 
          : 'opacity-0 transform scale-95',
        className
      )}
    >
      {children}
    </div>
  );
};

export const Stagger = ({ children, className, delay = 100, initialDelay = 0 }: StaggerProps) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <div 
          key={index} 
          className="transition-all"
          style={{ 
            animationDelay: `${initialDelay + (index * delay)}ms`,
            opacity: 0,
            animation: 'fadeIn 0.5s forwards',
            // animationDelay: `${initialDelay + (index * delay)}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
