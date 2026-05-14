'use client';

import React from 'react';

interface CircularStatProps {
  value: string | number;
  label: string;
}

export default function CircularStat({ value, label }: CircularStatProps) {
  const radius = 60;

  return (
    <div 
      role="img" 
      aria-label={`${label}: ${value}`}
      style={{ 
        position: 'relative', 
        width: '130px', 
        height: '130px', 
        flexShrink: 0 
      }}
    >
      <svg 
        width="130" 
        height="130" 
        style={{ transform: 'rotate(-90deg)' }} 
        aria-hidden="true"
      >
        <circle
          cx="65" 
          cy="65" 
          r={radius}
          fill="none" 
          stroke="var(--white-to-blue)" 
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: 'absolute', 
        inset: 0,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--white-bg)',
      }}>
        <span 
          aria-hidden="true" 
          style={{ fontWeight: 'bold', fontSize:'1.875rem' ,lineHeight: 1 }}
        >
          {value}
        </span>
        <span 
          aria-hidden="true"
        >
          {label}
        </span>
      </div>
    </div>
  );
}