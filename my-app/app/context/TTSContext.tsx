'use client';

import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

interface TTSState {
  playingSectionId: string | null;
  playingSectionTitle: string;
  isPlaying: boolean;
  rate: number;
}

interface TTSContextValue extends TTSState {
  play: (sectionId: string, sectionTitle: string, text: string) => void;
  stop: () => void;
  togglePause: () => void;
  changeRate: (delta: number) => void;
  restart: () => void;
  skip: (seconds: number) => void;
}

const TTSContext = createContext<TTSContextValue | null>(null);

export function useTTS() {
  const ctx = useContext(TTSContext);
  if (!ctx) throw new Error('useTTS must be used inside TTSProvider');
  return ctx;
}

export function TTSProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TTSState>({
    playingSectionId: null,
    playingSectionTitle: '',
    isPlaying: false,
    rate: 1.0,
  });

  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const fullTextRef = useRef('');
  const rateRef = useRef(1.0);
  
  const absoluteOffsetRef = useRef(0); 
  const relativeProgressRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const currentJobId = useRef(0);

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePlayingRef = useRef(false);

  const loadVoices = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    voiceRef.current =
      voices.find(v => v.name.toLowerCase().includes('natural') && v.lang.startsWith('en')) ||
      voices.find(v => v.name.toLowerCase().includes('google')  && v.lang.startsWith('en')) ||
      voices.find(v => v.name.includes('Samantha')) ||
      voices.find(v => v.lang.startsWith('en-US')) ||
      voices[0];
  }, []);

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => forceCleanExit();
  }, [loadVoices]);

  const getFineGrainedPos = () => {
    if (!activePlayingRef.current || startTimeRef.current === 0) {
      return absoluteOffsetRef.current + relativeProgressRef.current;
    }
    const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
    const estimatedCharsMoved = elapsedSeconds * 15 * rateRef.current;
    return absoluteOffsetRef.current + Math.max(relativeProgressRef.current, estimatedCharsMoved);
  };

  const forceCleanExit = useCallback(() => {
    activePlayingRef.current = false;
    currentJobId.current += 1;
    startTimeRef.current = 0;
    
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }

    window.speechSynthesis.cancel();
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  const speakFrom = useCallback((newAbsoluteStart: number, shouldActuallySpeak: boolean) => {
    forceCleanExit();
    const jobId = currentJobId.current;

    absoluteOffsetRef.current = newAbsoluteStart;
    relativeProgressRef.current = 0;

    if (!shouldActuallySpeak) return;

    const textSlice = fullTextRef.current.slice(newAbsoluteStart);
    if (!textSlice.trim()) {
      stop();
      return;
    }

    activePlayingRef.current = true;

    pendingTimeoutRef.current = setTimeout(() => {
      if (!activePlayingRef.current || jobId !== currentJobId.current) return;

      const utt = new SpeechSynthesisUtterance(textSlice);
      utt.voice = voiceRef.current;
      utt.rate = rateRef.current;
      utt.pitch = 0.95;

      utt.onstart = () => {
        if (jobId === currentJobId.current) {
          startTimeRef.current = Date.now();
        }
      };

      utt.onboundary = (e) => {
        if (e.name === 'word' && jobId === currentJobId.current) {
          relativeProgressRef.current = e.charIndex;
        }
      };

      utt.onend = () => {
        if (jobId === currentJobId.current && activePlayingRef.current) {
          stop();
        }
      };

      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      heartbeatRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);

      window.speechSynthesis.speak(utt);
      pendingTimeoutRef.current = null;
    }, 30); 
  }, [forceCleanExit]);

  const play = useCallback((sectionId: string, sectionTitle: string, text: string) => {
    fullTextRef.current = text;
    setState(prev => ({ ...prev, playingSectionId: sectionId, playingSectionTitle: sectionTitle, isPlaying: true }));
    speakFrom(0, true);
  }, [speakFrom]);

  const stop = useCallback(() => {
    forceCleanExit();
    absoluteOffsetRef.current = 0;
    relativeProgressRef.current = 0;
    setState(prev => ({ ...prev, isPlaying: false, playingSectionId: null }));
  }, [forceCleanExit]);

  const togglePause = useCallback(() => {
    const currentPos = getFineGrainedPos();

    if (state.isPlaying) {
      forceCleanExit();
      absoluteOffsetRef.current = currentPos;
      relativeProgressRef.current = 0;
      setState(prev => ({ ...prev, isPlaying: false }));
    } else if (state.playingSectionId) {
      setState(prev => ({ ...prev, isPlaying: true }));
      speakFrom(absoluteOffsetRef.current, true);
    }
  }, [state.isPlaying, state.playingSectionId, speakFrom, forceCleanExit]);

  const changeRate = useCallback((delta: number) => {
    const currentPos = getFineGrainedPos();
    const newRate = Math.round(Math.max(0.5, Math.min(2.0, rateRef.current + delta)) * 100) / 100;
    
    rateRef.current = newRate;
    setState(prev => ({ ...prev, rate: newRate }));
    
    if (state.playingSectionId) {
      speakFrom(currentPos, state.isPlaying);
    }
  }, [state.playingSectionId, state.isPlaying, speakFrom]);

  const skip = useCallback((seconds: number) => {
    const currentPos = getFineGrainedPos();
    const charsPerSec = 15 * rateRef.current;
    const newTarget = Math.max(0, Math.min(currentPos + (seconds * charsPerSec), fullTextRef.current.length));
    
    setState(prev => ({ ...prev, isPlaying: true }));
    speakFrom(newTarget, true);
  }, [speakFrom]);

  const restart = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
    speakFrom(0, true);
  }, [speakFrom]);

  return (
    <TTSContext.Provider value={{ ...state, play, stop, togglePause, changeRate, restart, skip }}>
      {children}
    </TTSContext.Provider>
  );
}