'use client';

import { BookText, Pencil } from 'lucide-react';
import Image from 'next/image';
import { Course } from '@/app/types/course';

type Tab = 'topics' | 'tests';

interface CourseHeroProps {
  course: Course;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'topics', label: 'Topics', icon: <BookText size={16} aria-hidden="true" /> },
  { key: 'tests',  label: 'Tests',  icon: <Pencil   size={16} aria-hidden="true" /> },
];

export default function CourseHero({ course, activeTab, onTabChange }: CourseHeroProps) {
  return (
    <section
      aria-label="Course Header"
      style={{
        background: 'var(--blue-to-black)',
        border: '3px solid var(--hero-border)',
        borderRadius: '20px',
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        marginBottom: '28px',
        flexWrap: 'wrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        flex: '1 1 350px',
        minWidth: 0,
        maxWidth: '100%'
      }}>
        <h1 style={{ 
          color: 'var(--white-bg)', 
          margin: 0, 
          lineHeight: '1.1',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          maxWidth: '100%'
        }}>
          {course.title}
        </h1>
        <p style={{ 
          color: 'var(--white-bg)', 
          margin: 0,
          fontWeight: '600',
          maxWidth: '100%'
        }}>
          Lecturer : {course.lecturer}
        </p>

        <div
          role="tablist"
          aria-label="Course sections"
          style={{
            display: 'flex',
            marginTop: '12px',
            border: '3px solid var(--tabs-border)',
            borderRadius: '15px', 
            alignSelf: 'flex-start',
            overflow: 'hidden',
            maxWidth: '100%',
            flexWrap: 'wrap'
          }}
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls="course-content-panel"
              id={`tab-${tab.key}`}
              onClick={() => onTabChange(tab.key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                padding: '8px 24px 6px 24px',
                flex: '1 1 auto',
                minWidth: '110px',
                background: 'var(--secondary-bg)',
                color: 'var(--blue-to-white)',
                border: 'none',
                borderLeft: i !== 0 ? '3px solid var(--blue-to-white)' : 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {tab.icon}
                {tab.label}
              </span>
              <span
                style={{
                    display: 'block',
                    height: '3px',
                    width: '100%',
                    borderRadius: '2px',
                    background: activeTab === tab.key ? 'var(--blue-to-white)' : 'transparent',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {course.image && (
         <div
            style={{
              borderRadius: '45px',
              maxWidth: '350px', 
              aspectRatio: '350 / 240', 
              overflow: 'hidden',
              border: '4px solid var(--white-bg)',
              position: 'relative',
              width: '100%' 
            }}
          >
            <Image
              src={course.image}
              alt="" 
              aria-hidden="true" 
              fill 
              priority
              sizes="(max-width: 768px) 100vw, 350px"
              style={{ objectFit: 'cover' }}
            />
          </div>
      )}
    </section>
  );
}