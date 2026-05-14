'use client';
 
import { useState, useEffect } from 'react';
import { getCourse } from '@/app/data/courses';
import CourseHero from '@/app/components/CourseHero';
import TestCard from '@/app/components/TestCard';
import TopicCard from '@/app/components/TopicCard';
import { useBreadcrumb } from '@/app/context/BreadCrumbContext';
 
export default function CourseDetailPage({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<'topics' | 'tests'>('topics');
  
  const course = getCourse(courseId);
  const { setItems } = useBreadcrumb();
 
  useEffect(() => {
    if (!course) return;
    setItems([{ label: 'My Courses', href: '/' }, { label: course.title }]);
  }, [course, setItems]);
 
  if (!course) return <div role="alert">Course not found</div>;
 
  return (
    <div>
      <CourseHero course={course} activeTab={activeTab} onTabChange={setActiveTab} />
 
      <div 
        id="course-content-panel"
        role="tabpanel"
        aria-labelledby={activeTab === 'topics' ? 'tab-topics' : 'tab-tests'}
        style={{ marginTop: '60px' }} 
      >
        <h2 style={{ marginBottom: '20px' }}>
          {activeTab === 'topics' ? 'Course Topics' : 'Course Tests'}
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {activeTab === 'topics' ? (
            course.topics.length > 0 ? (
              course.topics.map(t => (
                <TopicCard 
                  key={t.id} 
                  topic={t} 
                  courseId={courseId} 
                />
              ))
            ) : (
              <p style={{fontStyle: 'italic' }}>
                No topics available for this course.
              </p>
            )
          ) : (
            course.tests.length > 0 ? (
              course.tests.map(test => (
                <TestCard
                  key={test.id} 
                  test={test}
                  courseId={courseId}
                />
              ))
            ) : (
              <p style={{fontStyle: 'italic' }}>
                No tests available for this course.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}