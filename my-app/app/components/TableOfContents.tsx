'use client';
 
import { useState } from 'react';
import { ChevronDown, ChevronUp, MoveRight } from 'lucide-react'; 
import { ContentSection } from '@/app/types/course';
 
interface TableOfContentsProps {
  sections: ContentSection[];
}

interface NumberedSection extends ContentSection {
  displayNumber: string;
}

function flattenSections(sections: ContentSection[], prefix = ''): NumberedSection[] {
  const result: NumberedSection[] = [];
  
  sections.forEach((section, index) => {
    const currentNumber = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
    
    result.push({
      ...section,
      displayNumber: currentNumber
    });

    if (section.sections && section.sections.length > 0) {
      result.push(...flattenSections(section.sections, currentNumber));
    }
  });
  
  return result;
}
 
export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
 
  const allItems = flattenSections(sections);
 
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const heading = el.querySelector('h2, h3') as HTMLElement;
      const focusTarget = heading || el;

      focusTarget.setAttribute('tabIndex', '-1');
      focusTarget.focus({ preventScroll: true });
      setIsOpen(false);
    }
  };
 
  return (
    <nav
      aria-label="Table of contents"
      style={{
        border: '3px solid var(--blue-accent)',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '32px',
        backgroundColor: 'var(--secondary-bg)',
        width: '100%'
      }}
    >
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls="toc-list" 
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: 'var(--blue-accent)',
          padding: '12px 20px',
          fontSize: '1.25rem',
        }}
      >
        {isOpen
          ? <ChevronUp size={18} aria-hidden="true" />
          : <ChevronDown size={18} aria-hidden="true" />
        }
        Table of contents
      </button>
 
      {isOpen && (
        <ol
          id="toc-list"
          style={{
            listStyle: 'none',
            padding: '0 20px 16px 20px',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {allItems.map((item) => {
            const label = `${item.displayNumber}. ${item.title}`;
 
            return (
              <li
                key={item.id}
                style={{
                  paddingLeft: item.level === 3 ? '20px' : '0',
                }}
              >
                <button
                  onClick={() => scrollTo(item.id)}
                  aria-label={`Jump to section: ${label}`} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--blue-accent)',
                    textDecoration: 'underline',
                    textAlign: 'left',
                  }}
                >
                  {label} 
                  <MoveRight size={14} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}