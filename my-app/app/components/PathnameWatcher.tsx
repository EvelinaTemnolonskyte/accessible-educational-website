'use client';
 
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
 
export default function PathnameWatcher() {
  const pathname = usePathname();
 
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.focus();
  }, [pathname]);
 
  return null;
}