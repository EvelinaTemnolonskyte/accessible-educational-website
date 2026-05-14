'use client';
 
import { useEffect, useState, useRef, useCallback } from 'react';
 
export default function useReadingProgress(topicId: string) {
  const STORAGE_KEY = `last_section_${topicId}`;
  const [lastSavedSection, setLastSavedSection] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const currentSectionRef = useRef<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const announcerRef = useRef<HTMLDivElement | null>(null);
 
  useEffect(() => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.setAttribute('role', 'status');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    announcerRef.current = announcer;
 
    return () => {
      document.body.removeChild(announcer);
    };
  }, []);
 
  const announce = useCallback((message: string) => {
    if (!announcerRef.current) return;
    announcerRef.current.textContent = '';
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;
      }
    }, 50);
  }, []);
 
  const getStickyOffset = useCallback(() => {
    const stickyEls = document.querySelectorAll('[data-sticky-position="top"]');
    let offset = 0;
 
    stickyEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 1 && rect.bottom > 0) {
        offset = Math.max(offset, rect.bottom);
      }
    });
 
    return offset || 0;
  }, []);
 
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setLastSavedSection(saved);
      setShowBanner(true);
    }
 
    const initObserver = () => {
      observerRef.current?.disconnect();
      const sections = document.querySelectorAll('section[data-section]');
      
      const offset = getStickyOffset();
      const triggerPoint = offset;
 
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              currentSectionRef.current = entry.target.id;
            }
          });
        },
        {
          rootMargin: `-${triggerPoint}px 0px -${window.innerHeight - triggerPoint - 1}px 0px`,
        }
      );
 
      sections.forEach((s) => observerRef.current?.observe(s));
    };
 
    initObserver();
    window.addEventListener('resize', initObserver);
    
    const saveOnExit = () => {
      if (currentSectionRef.current) {
        localStorage.setItem(STORAGE_KEY, currentSectionRef.current);
      }
    };
 
    window.addEventListener('beforeunload', saveOnExit);
    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('resize', initObserver);
      window.removeEventListener('beforeunload', saveOnExit);
      saveOnExit();
    };
  }, [STORAGE_KEY, getStickyOffset]);
 
  const scrollToLast = useCallback(() => {
    if (!lastSavedSection) return;
    setShowBanner(false);
 
    announce('Navigating to your last read section. Please wait.');
 
    setTimeout(() => {
      const el = document.getElementById(lastSavedSection);
      if (!el) return;
 
      const offset = getStickyOffset();
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const finalPosition = elementPosition - offset;
 
      window.scrollTo({
        top: finalPosition,
        behavior: 'smooth',
      });
 
      setTimeout(() => {
        const heading = document.getElementById(`heading-${lastSavedSection}`);
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus();
          announce(`Returned to section: ${heading.textContent}. You can continue reading.`);
        }
      }, 600);
    }, 100);
  }, [lastSavedSection, getStickyOffset, announce]);
 
  return { showBanner, scrollToLast, setShowBanner };
}