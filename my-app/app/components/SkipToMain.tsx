'use client';

import React from 'react';

export default function SkipToMain() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainElement = document.getElementById('main-content');
    
    if (mainElement) {
      mainElement.setAttribute('tabindex', '-1');
      mainElement.focus();
      mainElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      id="skip-link"
      href="#main-content"
      onClick={handleClick}
      className="skip-link" 
    >
      Skip to main content
    </a>
  );
}