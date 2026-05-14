'use client';

import React from 'react';

interface ResultCardProps {
  title: string;
  value: string | number;
  total?: string | number;
  footer: React.ReactNode;
}

export default function ResultCard({ 
  title, 
  value, 
  total, 
  footer 
}: ResultCardProps) {
  return (
    <div style={{ 
      border: '2px solid var(--blue-accent)', 
      borderTop: '5px solid var(--blue-accent)', 
      borderRadius: '20px', 
      padding: '28px 32px' ,
      width: '100%'
    }}>
      <h2 style={{ 
        margin: '0 0 12px 0' 
      }}>
        {title}
      </h2>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'baseline', 
        gap: '6px', 
        marginBottom: '12px', 
        marginTop: '12px' 
      }}>
        <span style={{ 
          fontSize: '2.125rem', 
          color: 'var(--blue-accent)', 
        }}>
          {value}
        </span>
        {total && (
          <span style={{ 
            fontSize: '1.25rem', 
            color: 'var(--section-text)', 
          }}>
            / {total}
          </span>
        )}
      </div>
      
      {footer}
    </div>
  );
}