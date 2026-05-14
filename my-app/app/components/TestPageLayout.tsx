'use client';
 
import { ReactNode } from 'react';
 
interface TestPageLayoutProps {
  header: ReactNode;
  children: ReactNode;
  headerBorderRadius?: string;
  bodyBorderRadius?: string;
}
 
export default function TestPageLayout({
  header,
  children,
  headerBorderRadius = '20px 20px 0 0',
  bodyBorderRadius = '0 0 20px 20px',
}: TestPageLayoutProps) {
  return (
    <div style={{ width: '100%' }}>
      <header style={{
        background: 'var(--blue-to-black)',
        border: '3px solid var(--blue-accent)',
        borderRadius: headerBorderRadius,
        padding: '36px 44px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px',
        color: 'var(--white-bg)',
        flexWrap: 'wrap', 
        overflow: 'hidden' 
      }}>
        {header}
      </header>
 
      <div style={{
        background: 'var(--secondary-bg)',
        border: '3px solid var(--blue-accent)',
        borderTop: 'none',
        borderRadius: bodyBorderRadius,
      }}>
        {children}
      </div>
    </div>
  );
}