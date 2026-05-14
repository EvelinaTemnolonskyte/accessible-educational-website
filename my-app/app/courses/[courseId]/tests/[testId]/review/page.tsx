'use client';
 
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MoveLeft } from 'lucide-react'; 
import { getCourse } from '@/app/data/courses';
import { TEST_QUESTIONS } from '@/app/data/testQuestions';
import { formatDuration } from '@/app/utils/timeFormat';
import ReviewAnswers from '@/app/components/ReviewAnswers';
import { useBreadcrumb } from '@/app/context/BreadCrumbContext';
 
interface SavedResult {
  earnedPoints: number;
  totalPoints: number;
  timeSpentSeconds: number;
  completedAt: string;
  attemptNumber: number;
}
 
export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const testId = params.testId as string;
 
  const course = getCourse(courseId);
  const questions = TEST_QUESTIONS[testId];
  const testData = course?.tests.find(t => t.id === testId);
 
  const [result, setResult] = useState<SavedResult | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [questionScores, setQuestionScores] = useState<Record<string, number>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const { setItems } = useBreadcrumb();
 
  const RESULT_KEY = `test_result_${courseId}_${testData?.name}`;
  const ANSWERS_KEY = `test_useranswers_${courseId}_${testData?.name}`;
  const QUESTION_SCORES_KEY = `test_question_scores_${courseId}_${testData?.name}`;
 
  useEffect(() => {
    if (!testData) return;
 
    const savedResult = localStorage.getItem(RESULT_KEY);
    if (!savedResult) {
      router.replace(`/courses/${courseId}/tests/${testId}/results`);
      return;
    }
 
    setItems([
      { label: 'My Courses', href: '/' },
      { label: course?.title || 'Course', href: `/courses/${courseId}` },
      { label: `Test ${testId}: ${testData.name} - Results`, href: `/courses/${courseId}/tests/${testId}/results` },
      { label: 'Review Answers' },
    ]);
 
    setResult(JSON.parse(savedResult));
    const savedAnswers = localStorage.getItem(ANSWERS_KEY);
    if (savedAnswers) setUserAnswers(JSON.parse(savedAnswers));
    const savedScores = localStorage.getItem(QUESTION_SCORES_KEY);
    if (savedScores) setQuestionScores(JSON.parse(savedScores));
    setIsInitialized(true);
  }, [RESULT_KEY, ANSWERS_KEY, QUESTION_SCORES_KEY, courseId, testId, router, testData, course?.title, setItems]);

  useEffect(() => {
    if (!isInitialized || !testData) return;
 
    const msg = document.createElement('div');
    msg.setAttribute('aria-live', 'assertive');
    msg.setAttribute('role', 'status');
    msg.className = 'sr-only';
    document.body.appendChild(msg);
 
    const timeout = setTimeout(() => {
      msg.textContent = `Reviewing answered questions for ${testData.name}`;
    }, 100);
 
    return () => {
      clearTimeout(timeout);
      document.body.removeChild(msg);
    };
  }, [isInitialized, testData]);
 
  if (!testData || !questions) {
    return <div role="alert" style={{ textAlign: 'center', padding: '40px' }}>Test content not found</div>;
  }
  
  if (!isInitialized || !result) return null;
 
  return (
    <div style={{ paddingBottom: '40px' }}>
      <h1 id="review-heading" className='sr-only'>
        Reviewing answers for {testData.name}
      </h1>

      <div style={{ marginTop: '20px' }}>
        <ReviewAnswers
          questions={questions}
          userAnswers={userAnswers}
          testName={testData.name}
          testId={testId}
          earnedPoints={result.earnedPoints}
          totalPoints={result.totalPoints}
          timeSpentSeconds={result.timeSpentSeconds}
          timeLimitDisplay={testData.durationSeconds ? formatDuration(testData.durationSeconds) : null}
          completedAt={result.completedAt}
          questionScores={questionScores}
        />
      </div>
 
      <nav aria-label="Review navigation">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button
            onClick={() => router.push(`/courses/${courseId}/tests/${testId}/results`)}
            aria-label="Back to test results"
            className='action-btn secondary-btn'
          >
            <MoveLeft size={20} aria-hidden="true" />
            Back to Results
          </button>
        </div>
      </nav>
    </div>
  );
}