'use client';
 
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCourse } from '@/app/data/courses';
import { TEST_QUESTIONS } from '@/app/data/testQuestions';
import TestEngine from '@/app/components/TestEngine';
import { useBreadcrumb } from '@/app/context/BreadCrumbContext';
 
export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const testId = params.testId as string; 
 
  const course = getCourse(courseId);
  const questions = TEST_QUESTIONS[testId];
  const testData = course?.tests.find(t => t.id === testId);
 
  const RESULT_KEY = `test_result_${courseId}_${testData?.name}`;
 
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const { setItems } = useBreadcrumb();
 
  useEffect(() => {
    if (!testData) return;
 
    const existingResult = localStorage.getItem(RESULT_KEY);
    if (existingResult) {
      router.replace(`/courses/${courseId}/tests/${testId}/results`);
      setIsInitialized(false);
      return;
    }
 
    setItems([
      { label: 'My Courses', href: '/' },
      { label: course?.title || 'Course', href: `/courses/${courseId}` },
      { label: `Test ${testData.id}: ${testData.name}` },
    ]);
    setIsInitialized(true);
  }, [RESULT_KEY, courseId, testId, router, testData, course?.title, setItems]);
 
  const handleComplete = () => {
    router.push(`/courses/${courseId}/tests/${testId}/results`);
  };
 
  if (!testData || !questions) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div role="alert">Test or questions not found.</div>
      </div>
    );
  }
 
  if (isInitialized !== true) return null;
 
  return (
    <div style={{ width: '100%', paddingBottom: '40px' }}>
      <h1 id="test-page-heading" className='sr-only'>
        Taking Test: {testData.name}
      </h1>
 
      <div style={{ marginTop: '20px' }}>
        <TestEngine
          questions={questions}
          testName={testData.name}
          testId={testId} 
          duration={testData.durationSeconds}
          maxAttempts={testData.attempts}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}