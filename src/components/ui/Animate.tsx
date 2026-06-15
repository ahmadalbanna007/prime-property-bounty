'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface AnimateProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  from = 'up',
}: AnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const base = 'transition-all duration-700 ease-out';
  const hidden: Record<string, string> = {
    up: 'translate-y-10 opacity-0',
    down: '-translate-y-10 opacity-0',
    left: 'translate-x-10 opacity-0',
    right: '-translate-x-10 opacity-0',
    fade: 'opacity-0',
  };

  return (
    <div
      ref={ref}
      className={`${base} ${visible ? 'translate-y-0 translate-x-0 opacity-100' : hidden[from]} ${className}`}
    >
      {children}
    </div>
  );
}

export function StaggerGrid({
  children,
  className = '',
  baseDelay = 100,
}: {
  children: ReactNode[];
  className?: string;
  baseDelay?: number;
}) {
  const childrenArray = Array.isArray(children) ? children : [children];
  return (
    <div className={className}>
      {childrenArray.map((child, i) => (
        <FadeIn key={i} delay={baseDelay * i} from="up">
          {child}
        </FadeIn>
      ))}
    </div>
  );
}
