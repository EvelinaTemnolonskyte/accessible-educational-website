'use client';
 
import React, { useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatDuration } from '@/app/utils/timeFormat';
import { formatDate } from '@/app/utils/dateFormat';
import TestPageLayout from './TestPageLayout';
import CircularStat from './CirclularStat';
import ResultCard from './ResultCard';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
 
interface TestResultsProps {
  testName: string;
  earnedPoints: number;
  totalPoints: number;
  timeSpentSeconds: number;
  timeLimitDisplay: string | null;
  completedAt: string;
  attemptNumber: number;
  maxAttempts: number | null;
  maxSemesterPoints: number;
  onRetake: () => void;
}
 
export default function TestResults({
  testName,
  earnedPoints,
  totalPoints,
  timeSpentSeconds,
  timeLimitDisplay,
  completedAt,
  attemptNumber,
  maxAttempts,
  maxSemesterPoints,
  onRetake,
}: TestResultsProps) {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const testId = params.testId as string;
 
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      resultsHeadingRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const hasMoreAttempts = maxAttempts === null || attemptNumber < maxAttempts;
  const semesterGrade = totalPoints > 0 
    ? ((earnedPoints / totalPoints) * maxSemesterPoints).toFixed(2) 
    : '0.00';
 
  const handleRetake = () => {
    onRetake();
  };
 
  const header = (
    <>
      <div style={{ color: 'var(--white-bg)' }}>
        <h1 
          ref={resultsHeadingRef}
          tabIndex={-1}
          aria-label={`Test ${testId}: ${testName} Results`}
          style={{ 
            margin: '0 0 16px', 
            color: 'var(--white-bg)',
            outline: 'none'
          }}
        >
          Test {testId} : {testName} - Results
        </h1>
        <div style={{ display: 'flex', gap: '48px', color: 'var(--white-bg)' }}>
          <div>
            <div style={{ marginBottom: '4px'}}>Completed</div>
            <time dateTime={completedAt} style={{ fontWeight: 'bold'}}>{formatDate(completedAt)}</time>
          </div>
           <div>
            <div style={{ marginBottom: '4px'}}>Time spent</div>
            <time style={{ fontWeight: 'bold'}}>{formatDuration(timeSpentSeconds)}</time>
          </div>
          {timeLimitDisplay && (
            <div>
              <div style={{ marginBottom: '4px'}}>Time limit</div>
              <div style={{ fontWeight: 'bold'}}>{timeLimitDisplay}</div>
            </div>
          )}
        </div>
      </div>
 
      <CircularStat 
        value={`${scorePercent} %`} 
        label="Score" 
      />
    </>
  );
 
  return (
    <TestPageLayout header={header}>
      <div style={{ padding: '44px' }}>
    
        <div 
          role="region" 
          aria-label="Result breakdown"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '36px', alignItems: 'stretch' }}
        >
          <div style={{ display: 'flex', flex: '1 1 280px' }}>
            <ResultCard
              title="Test score"
              value={earnedPoints}
              total={totalPoints}
              footer={
                <span style={{
                  display: 'inline-block',
                  background: 'var(--completed-label-bg)',
                  border: '2px solid var(--blue-accent)',
                  borderRadius: '20px',
                  padding: '4px 14px',
                  color: 'var(--blue-accent)',
                }}>
                  {scorePercent}% correct
                </span>
              }
            />
          </div>

          <div style={{ display: 'flex', flex: '1 1 280px' }}>
            <ResultCard
              title="Semester grade"
              value={semesterGrade}
              total={maxSemesterPoints}
              footer={
                <div style={{color: 'var(--main-text)' }}>
                  Contribution to your semester total
                </div>
              }
            />
          </div>
        </div>
 
        <div style={{ marginBottom: '32px' }}>
          {!hasMoreAttempts && (
            <div style={{ 
              color: 'var(--main-text)', 
              fontWeight: 'bold',
              marginBottom: '8px' 
            }}>
              Attempts exhausted
            </div>
          )}

          <Link 
            href={`/courses/${courseId}/tests/${testId}/review`}
            aria-label="Review answers"
          >
            Review Answers
            <MoveRight size={18} />
          </Link>
        </div>
 
        <nav 
          aria-label="Result actions"
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}
        >
          <Link
            href={`/courses/${courseId}`}
            className='action-btn secondary-btn'
            style={{ textDecoration: 'none' }}
          >
            Back to course
          </Link>
          
          {hasMoreAttempts && (
            <button
              onClick={handleRetake}
              className='action-btn primary-btn'
            >
              Retake test
            </button>
          )}
        </nav>
      </div>
    </TestPageLayout>
  );
}