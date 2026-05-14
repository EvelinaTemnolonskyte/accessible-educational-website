'use client';

import Link from 'next/link';
import { Play } from 'lucide-react'; 
import { useBreadcrumb } from '@/app/context/BreadCrumbContext';

export default function BreadcrumbBar() {
  const { items } = useBreadcrumb();

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      data-breadcrumb
      style={{
        backgroundColor: 'var(--primary-bg)',
        borderBottom: '2px solid var(--breadcrumb-border)',
        padding: '10px 20px',
        paddingTop: '32px',
        position: 'relative',
      }}
    >
      <ol
        style={{
          maxWidth: '900px',
          width: '80%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          listStyle: 'none',
          padding: 0
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  style={{ color: 'var(--blue-accent)'}}
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  style={{ color: 'var(--sections-text)'}}
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <Play 
                  size={10} 
                  fill="currentColor" 
                  style={{ color: 'var(--sections-text)' }} 
                  aria-hidden="true" 
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}