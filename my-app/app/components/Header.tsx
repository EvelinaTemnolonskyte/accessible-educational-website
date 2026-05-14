'use client';

import { Settings } from 'lucide-react';
import { useSettings } from '@/app/context/SettingsContext';

export default function Header() {
  const { isOpen, togglePanel } = useSettings();

  return (
      <header
        role="banner"
        style={{
          backgroundColor: 'var(--blue-to-black)',
          borderBottom: '4px solid var(--header-border)',
          minHeight: '56px',
          width: '100%',
          height: 'auto', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', 
          padding: '10px 20px',
          position: 'relative',
          top: 0,
          zIndex: 100,
        }}
      >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', 
          gap: '20px',
          flexWrap: 'wrap', 
        }}
      >
        <span
          role="img"
          aria-label="UniVerse Logo"
          style={{
            color: 'var(--white-bg)',
            fontSize: '1.25rem',
            flexShrink: 0,
          }}
        >
          UniVerse
        </span>

        <button
          onClick={togglePanel}
          aria-expanded={isOpen}
          aria-controls="settings-panel"
          aria-label={isOpen ? 'Close settings panel' : 'Open settings panel'}
          style={{
            padding: '8px 20px',
            border: '3px solid var(--white-bg)',
            borderRadius: '15px',
            backgroundColor: 'transparent',
            color: 'var(--white-bg)'
          }}
        >
          <Settings size={16} aria-hidden="true" />
          {isOpen ? 'Close Settings' : 'Settings'}
        </button>
      </div>
    </header>
  );
}