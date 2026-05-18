'use client';
 
import React, { useRef, useEffect } from 'react';
import { useTTS } from '@/app/context/TTSContext';
import StepperButton from './StepperButton';
import { SkipBack, Play, Pause, X } from 'lucide-react';
 
export default function TTSPlayerBar() {
  const { playingSectionId, playingSectionTitle, isPlaying, rate, stop, togglePause, changeRate, restart, skip } = useTTS();
  const playerRef = useRef<HTMLElement>(null);
  const rateRef = useRef(rate);
  
  useEffect(() => { rateRef.current = rate; }, [rate]);

  useEffect(() => {
    if (playingSectionId) {
      playerRef.current?.focus();
    }
  }, [playingSectionId]);
 
  if (!playingSectionId) return null;
 
  const iconBtn = (onClick: () => void, label: string, content: React.ReactNode, large = false) => (
    <button 
      onClick={onClick} 
      aria-label={label} 
      aria-pressed={label === 'Play' || label === 'Pause' ? isPlaying : undefined} 
      style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        border: large ? 'none' : '3px solid var(--white-bg)', 
        borderRadius: large ? '50%' : '10px', 
        background: large ? 'var(--white-bg)' : 'transparent', 
        color: large ? 'var(--blue-to-black)' : 'var(--white-bg)', 
        cursor: 'pointer', width: large ? '52px' : '63px', height: large ? '52px' : '32px' 
      }}
    >
      <span aria-hidden="true">{content}</span>
    </button>
  );
 
  return (
    <section 
      ref={playerRef}
      tabIndex={-1}
      role="region" 
      aria-label="Player" 
      style={{ 
        width: '100%', 
        background: 'var(--blue-to-black)', 
        display: 'flex', 
        justifyContent: 'center', 
        zIndex: 100, 
        outline: 'none' 
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1280px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px 32px', 
        gap: '24px',
        flexWrap: 'wrap', 
      }}>
        <a 
          href={`#listen-btn-${playingSectionId}`}
          className='skip-link'
        >
          Jump back to {playingSectionTitle}
        </a>

        <div style={{ flex: '1 1 250px', minWidth: 0, textAlign: 'center' }}>
          <div style={{ color: 'var(--white-bg)', fontSize: '0.85rem' }}>Now Playing</div>
          <div aria-live="polite" style={{ color: 'var(--white-bg)', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{playingSectionTitle}</div>
        </div>
  
        <div 
          role="group" 
          aria-label="Playback" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            flex: '2 1 300px', 
            justifyContent: 'center',
            minWidth: 'fit-content'
          }}
        >
          {iconBtn(restart, 'Restart audio', <SkipBack size={16} fill="currentColor" />)}
          {iconBtn(() => skip(-10), 'Skip back 10 seconds', <span>-10s</span>)}
          {iconBtn(
            togglePause, 
            isPlaying ? 'Pause' : 'Play', 
            isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />, true)}
          {iconBtn(() => skip(10), 'Skip forward 10 seconds', <span>+10s</span>)}
        </div>
  
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px', 
          flex: '1 1 250px', 
          justifyContent: 'center' 
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span id="speed-label" style={{ color: 'var(--white-bg)', marginBottom: '4px', fontSize: '0.85rem' }}>Speed</span>
            <StepperButton
              value={rate}
              min={0.5} max={2.0} step={0.25}
              unit="x" label="speed" borderColor="var(--white-bg)"
              onIncrement={() => {
                const nextStep = Math.floor(rate / 0.25 + 0.01) * 0.25 + 0.25;
                changeRate(nextStep - rate);
              }}
              onDecrement={() => {
                const prevStep = Math.ceil(rate / 0.25 - 0.01) * 0.25 - 0.25;
                changeRate(prevStep - rate);
              }}
              onChange={(v) => changeRate(v - rateRef.current)}
              aria-labelledby="speed-label"
            />
          </div>
          <button 
            onClick={stop} 
            aria-label="Stop and return focus to section" 
            style={{ 
              background: 'none', border: '2px solid white', color: 'white', 
              borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <X size={16} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}