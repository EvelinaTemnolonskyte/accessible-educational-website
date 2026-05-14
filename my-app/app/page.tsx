'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import CourseCard from '@/app/components/CourseCard';
import { COURSES } from '@/app/data/courses';
import { useBreadcrumb } from '@/app/context/BreadCrumbContext';

export default function Home() {
  const [query, setQuery] = useState('');
  const { setItems } = useBreadcrumb(); 

  useEffect(() => {
    setItems([]);
  }, [setItems]);

  const allCoursesArray = useMemo(() => {
    return Object.values(COURSES).map(course => ({
      id: course.id,
      title: course.title,
      lecturer: course.lecturer,
      href: `/courses/${course.id}`, 
    }));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCoursesArray;
    
    return allCoursesArray.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.lecturer.toLowerCase().includes(q)
    );
  }, [query, allCoursesArray]);

  return (
    <div style={{ width: '100%', padding: '0 1rem' }}>
      <h1>
        My Courses
      </h1>

      <section 
        role="search" 
        aria-label="Course search"
        style={{ marginBottom: '2rem' }}
      >
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            width: 'clamp(200px, 100%, 320px)', 
          }}
        >
          <Search
            size={16}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--main-text)',
              pointerEvents: 'none',
              flexShrink: 0,
            }}
          />
          <input
            id="course-search"
            type="search"
            placeholder="Search courses..."
            aria-label="Search courses by title or lecturer"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.2em 1em 0.2em 2.25em',
              borderRadius: '15px',
              border: '2px solid var(--sections-text)',
              backgroundColor: 'var(--secondary-bg)',
              color: 'var(--sections-text)',
            }}
          />
        </div>

        <div 
          aria-live="polite" 
          aria-atomic="true" 
          style={{ 
            position: 'absolute', 
            width: '1px', 
            height: '1px', 
            padding: '0', 
            margin: '-1px', 
            overflow: 'hidden', 
            clip: 'rect(0,0,0,0)', 
            border: '0'
          }}
        >
          {query && `${filtered.length} courses found for ${query}`}
        </div>
      </section>

      <ul
        aria-label="Available courses"
        style={{
          display: 'flex',
          flexDirection: 'column', 
          gap: '1.25rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {filtered.length > 0 ? (
          filtered.map(course => (
            <li key={course.id}>
              <CourseCard 
                id={course.id}
                title={course.title}
                lecturer={course.lecturer}
                href={course.href}
              />
            </li>
          ))
        ) : (
          <li
            role="status"
            style={{
              color: 'var(--main-text)',
              padding: '1rem 0',
              fontStyle: 'italic'
            }}
          >
            No courses found for "{query}"
          </li>
        )}
      </ul>
    </div>
  );
}