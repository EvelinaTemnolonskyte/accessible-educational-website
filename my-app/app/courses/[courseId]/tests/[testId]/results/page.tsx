'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Timer, ClipboardList } from 'lucide-react';
import { getCourse } from '@/app/data/courses';
import { formatDuration } from '@/app/utils/timeFormat';
import TestResults from '@/app/components/TestResults';
import BaseModal from '@/app/components/BaseModal';
import { useBreadcrumb } from '@/app/context/BreadCrumbContext';
import { TEST_QUESTIONS } from '@/app/data/testQuestions';

interface SavedResult {
  earnedPoints: number;
  totalPoints: number;
  timeSpentSeconds: number;
  completedAt: string;
  attemptNumber: number;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const testId = params.testId as string; 

  const course = getCourse(courseId);
  const testData = course?.tests.find(t => t.id === testId);

  const [result, setResult] = useState<SavedResult | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const { setItems } = useBreadcrumb();

  const RESULT_KEY = `test_result_${courseId}_${testData?.name}`;
  const PROGRESS_KEY = `test_progress_${courseId}_${testData?.name}`;
  const ANSWERS_KEY = `test_useranswers_${courseId}_${testData?.name}`;

  const maxAttempts = testData?.attempts ?? null;
  const usedAttempts = result?.attemptNumber ?? 0;
  const attemptsLeft = maxAttempts !== null ? maxAttempts - usedAttempts : null;

  useEffect(() => {
    if (!testData) return;

    setItems([
      { label: 'My Courses', href: '/' },
      { label: course?.title || 'Course', href: `/courses/${courseId}` },
      { label: `Test ${testId}: ${testData.name} - Results` },
    ]);

    const saved = localStorage.getItem(RESULT_KEY);
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      router.replace(`/courses/${courseId}/tests/${testId}/start`);
    }
    setIsInitialized(true);
  }, [RESULT_KEY, courseId, testId, router, testData, course?.title, setItems]);

  if (!testData) return <div role="alert" style={{ textAlign: 'center', padding: '50px' }}>Test not found</div>;
  if (!isInitialized || !result) return null;

  const handleConfirmRetake = () => {
    localStorage.removeItem(RESULT_KEY);
    localStorage.removeItem(ANSWERS_KEY);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ pending: true }));
    
    window.dispatchEvent(new CustomEvent('test-completed-sync', {
      detail: { courseId, testName: testData?.name, started: true }
    }));

    router.push(`/courses/${courseId}/tests/${testId}/start`);
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ marginTop: '20px' }}>
        <h1 id="results-heading" className='sr-only'>
          Test Results for {testData.name}
        </h1>
        
        <TestResults
          testName={testData.name}
          earnedPoints={result.earnedPoints}
          totalPoints={result.totalPoints}
          timeSpentSeconds={result.timeSpentSeconds}
          timeLimitDisplay={testData.durationSeconds ? formatDuration(testData.durationSeconds) : null}
          completedAt={result.completedAt}
          attemptNumber={result.attemptNumber}
          maxAttempts={testData.attempts}
          maxSemesterPoints={testData.maxSemesterPoints}
          onRetake={() => setShowRetakeModal(true)}
        />
      </div>

      <BaseModal
        isOpen={showRetakeModal}
        onClose={() => setShowRetakeModal(false)}
        onConfirm={handleConfirmRetake}
        title="Retake this test?"
        subtitle={`Test ${testId} : ${testData.name}`}
        confirmText="Start Retake"
      >
        <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '20px' }}>
            {testData.description}
          </p>
          
          <div 
            style={{ display: 'flex', gap: '30px', fontWeight: 'bold' }}
            aria-label="Test summary"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Timer size={16} aria-hidden="true"/>
              <span>{testData.durationSeconds ? formatDuration(testData.durationSeconds) : 'No limit'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={16} aria-hidden="true"/>
              <span>{TEST_QUESTIONS[testData.id]?.length || 0} questions</span>
            </div>
          </div>

          {maxAttempts !== null && (
            <p aria-label={`${attemptsLeft} out of ${maxAttempts} attempts remaining`}>
              Attempts remaining : 
              <span style={{color: 'var(--blue-accent)'}}> {attemptsLeft}</span>
              <span aria-hidden="true"> / {maxAttempts}</span>
            </p>
          )}

          <div role="alert" style={{ textAlign: 'left', marginTop: '12px'}}>
            <span>Important:</span> Starting a retake will clear your current score.
            {testData.durationSeconds && (
              <p>
                Once you click “Start”, the timer will begin. You cannot pause the test.
              </p>
            )}
          </div>
        </div>
      </BaseModal>
    </div>
  );
}