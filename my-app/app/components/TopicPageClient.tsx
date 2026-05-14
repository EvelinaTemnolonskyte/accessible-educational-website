'use client';

import { useEffect, useRef } from 'react';
import { getCourse } from '@/app/data/courses';
import { getTopicContent } from '@/app/data/topicContentData';
import { useBreadcrumb } from '@/app/context/BreadCrumbContext';
import useReadingProgress from '@/app/hooks/useReadingProgress';
import TableOfContents from '@/app/components/TableOfContents';
import ContentSection from '@/app/components/ContentSection';
import { useTTS } from '@/app/context/TTSContext';

interface TopicPageClientProps {
  courseId: string;
  topicId: string;
}

export default function TopicPageClient({ courseId, topicId }: TopicPageClientProps) {
  const content = getTopicContent(courseId, topicId);
  const course = getCourse(courseId);
  const { setItems } = useBreadcrumb();
  const { showBanner, scrollToLast, setShowBanner } = useReadingProgress(topicId);
  const bannerRef = useRef<HTMLDivElement>(null);
  const { stop } = useTTS();

  useEffect(() => {
    setItems([
      { label: 'My Courses', href: '/' },
      { label: course?.title ?? 'Course', href: `/courses/${courseId}` },
      { label: content?.topicName ?? 'Topic' },
    ]);
    return () => {
      stop(); 
      setItems([]); 
    };
  }, [courseId, topicId, course?.title, content?.topicName, setItems, stop]);
  
  if (!content) {
    return (
      <div style={{ width: '100%', textAlign: 'center', padding: '32px 0' }}>
        <h1 
          role="alert" 
          style={{marginBottom: '16px' }}
        >
          Topic not found
        </h1>
        <p>
          Content for this topic is not available yet.
        </p>
      </div>
    );
  }

  return (
      <div style={{ width: '100%', paddingBottom: '120px' }}>
        {showBanner && (
          <div
            ref={bannerRef}
            role="region"
            aria-live="polite" 
            aria-label="Resume reading notification"
            tabIndex={-1}
            style={{
              marginBottom: '20px',
              padding: '16px 20px',
              backgroundColor: 'var(--secondary-bg)',
              border: '3px solid var(--blue-accent)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              outline: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p style={{fontWeight: 'bold', margin: 0 }}>
                Continue where you left off?
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowBanner(false)}
                className="action-btn secondary-btn"
              >
                No, start over
              </button>
              <button
                onClick={scrollToLast}
                className = "action-btn primary-btn"
              >
                Yes, take me there
              </button>
            </div>
          </div>
        )}

        <article
          style={{
            backgroundColor: 'var(--secondary-bg)',
            border: '3px solid var(--blue-accent)',
            borderRadius: '15px',
            padding: '32px',
          }}
        >
          <h1 
            id="main-topic-heading" 
            style={{marginBottom: '28px' }}
          >
            {content.topicName}
          </h1>
          
          <TableOfContents sections={content.sections} />
          
          <div style={{ marginTop: '32px' }}>
            {content.sections.map(section => (
              <ContentSection key={section.id} section={section} />
            ))}
          </div>
        </article>
      </div>
  );
}