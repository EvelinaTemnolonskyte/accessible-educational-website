'use client';
import { useRef } from 'react';
import { useStickyShell } from '@/app/hooks/useStickyShell';

export default function StickyShell({ 
  children, 
  position = 'top' 
}: { 
  children: React.ReactNode,
  position?: 'top' | 'bottom'
}) {
  const ref = useRef<HTMLDivElement>(null);
  useStickyShell(ref, position);

  return (
    <div ref={ref} className="app-sticky-shell" data-sticky-position={position}>
      {children}
    </div>
  );
}