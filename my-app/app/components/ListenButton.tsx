'use client';
 
import { useRef, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useTTS } from '@/app/context/TTSContext';
 
interface ListenButtonProps {
  sectionId: string;
  sectionTitle: string;
  text: string;
}
 
export default function ListenButton({ sectionId, sectionTitle, text }: ListenButtonProps) {
  const { play, stop, playingSectionId } = useTTS();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasPlayingRef = useRef(false);
 
  const isThisSection = playingSectionId === sectionId;
 
  useEffect(() => {
    if (isThisSection) {
      wasPlayingRef.current = true;
    }
    if (!playingSectionId && wasPlayingRef.current) {
      wasPlayingRef.current = false;
      buttonRef.current?.focus();
    }
  }, [playingSectionId, isThisSection]);
 
  const handleClick = () => {
    if (isThisSection) {
      stop();
    } else {
      play(sectionId, sectionTitle, text);
    }
  };
 
  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      id={`listen-btn-${sectionId}`}
      aria-label={isThisSection ? `Stop listening to ${sectionTitle}` : `Listen to ${sectionTitle}`}
      aria-pressed={isThisSection}
      className="action-btn primary-btn"
    >
      {isThisSection ? (
        <>
          Stop
          <Square size={16} aria-hidden="true" />
        </>
      ) : (
        <>
          Listen
          <Volume2 size={16} aria-hidden="true" />
        </>
      )}
    </button>
  );
}