'use client';
 
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Timer, ClipboardList, Check, MoveRight } from 'lucide-react'; 
import { CourseTest } from '@/app/types/course';
import { TEST_QUESTIONS } from '@/app/data/testQuestions';
import { formatDuration } from '@/app/utils/timeFormat';
import BaseModal from './BaseModal';
 
function buildKeys(courseId: string, testName: string) {
  return {
    RESULT:   `test_result_${courseId}_${testName}`,
    PROGRESS: `test_progress_${courseId}_${testName}`,
    ANSWERS:  `test_useranswers_${courseId}_${testName}`,
    ATTEMPTS: `test_attempts_count_${courseId}_${testName}`,
  };
}
 
export default function TestCard({ test, courseId }: { test: CourseTest; courseId: string }) {
  const router = useRouter();
  const KEYS = useMemo(() => buildKeys(courseId, test.name), [courseId, test.name]);
  
  const [localResult, setLocalResult] = useState<any>(() => {
    if (typeof window === 'undefined') return null;
    const res = localStorage.getItem(KEYS.RESULT);
    return res ? JSON.parse(res) : null;
  });
 
  const [savedProgress, setSavedProgress] = useState<any>(() => {
    if (typeof window === 'undefined') return null;
    const prog = localStorage.getItem(KEYS.PROGRESS);
    return prog ? JSON.parse(prog) : null;
  });
 
  const [attemptsUsed, setAttemptsUsed] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem(KEYS.ATTEMPTS) || '0');
  });
 
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const loadFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    const res = localStorage.getItem(KEYS.RESULT);
    const prog = localStorage.getItem(KEYS.PROGRESS);
    const attempts = parseInt(localStorage.getItem(KEYS.ATTEMPTS) || '0');
    setLocalResult(res ? JSON.parse(res) : null);
    setSavedProgress(prog ? JSON.parse(prog) : null);
    setAttemptsUsed(attempts);
  }, [KEYS.RESULT, KEYS.PROGRESS, KEYS.ATTEMPTS]);
 
  useEffect(() => {
    loadFromStorage();
    const handleSync = (e: any) => {
      if (e.detail?.courseId === courseId && e.detail?.testName === test.name) {
        loadFromStorage();
      }
    };
 
    window.addEventListener('test-completed-sync', handleSync);
    window.addEventListener('storage', loadFromStorage);
    window.addEventListener('focus', loadFromStorage);
    
    return () => {
      window.removeEventListener('test-completed-sync', handleSync);
      window.removeEventListener('storage', loadFromStorage);
      window.removeEventListener('focus', loadFromStorage);
    };
  }, [loadFromStorage, courseId, test.name]);
 
  const isCompleted = !!localResult;
  const isInProgress = !!savedProgress;
  const maxAttempts = test.attempts ?? null;
  const attemptsRemaining = maxAttempts !== null ? Math.max(0, maxAttempts - attemptsUsed) : null;
 
  const cardStyle: React.CSSProperties = {
    background: 'var(--secondary-bg)',
    border: '3px solid var(--blue-accent)',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 260px',
  };
 
  const headerStyle: React.CSSProperties = {
    background: 'var(--blue-to-black)',
    borderBottom: '3px solid var(--blue-accent)',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var(--white-bg)',
  };
 
  const bodyStyle: React.CSSProperties = {
    padding: '20px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  };
 
  const statsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    margin: '12px 0',
    color: 'var(--main-text)',
  };
 
  const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--blue-accent)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  };
 
  const modalStatsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    gap: '30px',
    fontWeight: 'bold',
  };
 
  const statusConfig = useMemo(() => {
    if (isCompleted) {
      return { 
        label: 'Completed', 
        icon: <Check size={16} />, 
        background: 'var(--completed-label-bg)', 
        btn: 'View results', 
        color: 'var(--blue-accent)', 
        borderColor: 'var(--header-border)' 
      };
    }
    if (isInProgress) {
      return { 
        label: 'In Progress...', 
        icon: null, 
        btn: 'Continue test', 
        color: 'var(--white-bg)', 
        borderColor: 'var(--white-bg)',
        background: 'transparent'
      };
    }
    return { 
      label: 'Not started', 
      icon: null, 
      background: 'var(--main-text)', 
      btn: 'Start test', 
      color: 'var(--secondary-bg)', 
      borderColor: 'var(--not-started-label-border)' 
    };
  }, [isCompleted, isInProgress]);
 
  const handleConfirmStart = () => {
    setIsModalOpen(false);
    localStorage.removeItem(KEYS.RESULT);
    localStorage.removeItem(KEYS.ANSWERS);
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify({ pending: true }));
    
    setLocalResult(null);
    setSavedProgress({ pending: true }); 
 
    window.dispatchEvent(new CustomEvent('test-completed-sync', {
      detail: { courseId, testName: test.name, started: true }
    }));
 
    router.push(`/courses/${courseId}/tests/${test.id}/start`);
  };
 
  const handleAction = () => {
    if (isCompleted) return router.push(`/courses/${courseId}/tests/${test.id}/results`);
    if (isInProgress) return router.push(`/courses/${courseId}/tests/${test.id}/start`);
    setIsModalOpen(true);
  };
 
  const questionCount = TEST_QUESTIONS[test.id]?.length || 0;
  const timeLimit = test.durationSeconds ? formatDuration(test.durationSeconds) : 'No limit';
 
  const statusBadgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    borderRadius: '20px',
    border: `2px solid ${statusConfig.borderColor}`,
    background: statusConfig.background,
    color: statusConfig.color,
  };
 
  return (
    <article style={cardStyle}>
      <div style={headerStyle}>
        <span style={{fontSize: '1.25rem'}}>Test {test.id}</span>
        <span style={statusBadgeStyle}>
          {statusConfig.icon}{statusConfig.label}
        </span>
      </div>
 
      <div style={bodyStyle}>
        <h3 style={{ margin: '0 0 8px' }}>{test.name}</h3>
        <p style={{ color: 'var(--main-text)', marginBottom: '12px', fontWeight:'bold'}}>{test.description}</p>
        
        <div style={statsContainerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight:'bold' }}>
            <Timer size={16} aria-hidden="true" />
            {timeLimit}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight:'bold' }}>
            <ClipboardList size={16} aria-hidden="true" />
            {questionCount} questions
          </div>
        </div>
 
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleAction}
            style={actionButtonStyle}
            aria-label={`${statusConfig.btn}: Test ${test.id}, ${test.name}`}
          >
            {statusConfig.btn} <MoveRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
 
      {isModalOpen && (
        <BaseModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handleConfirmStart} 
          title={isCompleted ? "Retake this test?" : "Ready to start?"} 
          subtitle={`Test ${test.id} : ${test.name}`}
          confirmText={isCompleted ? "Start Retake" : "Start Test"}
        >
          <div>
            <p style={{ marginBottom: '20px', color: 'var(--main-text)' }}>
              {test.description}
            </p>
            
            <div style={modalStatsWrapperStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Timer size={16} aria-hidden="true" />
                <span>{timeLimit}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={16} aria-hidden="true" />
                <span>{questionCount} questions</span>
              </div>
            </div>
 
            {maxAttempts !== null && (
              <p 
                aria-label={`${attemptsRemaining} out of ${maxAttempts} attempts remaining`}
              >
                Attempts remaining : 
                <span style={{ color: 'var(--blue-accent)'}}> {attemptsRemaining}</span>
                <span aria-hidden="true" style={{color: 'var(--main-text)' }}> / {maxAttempts}</span>
              </p>
            )}
 
            {timeLimit !== 'No limit' && (
              <div style={{ 
                textAlign: 'left', 
                marginTop: '12px',
              }}>
                <span>Important:</span> Once you click "Start", the timer will begin. You cannot pause the test.
              </div>
            )}
          </div>
        </BaseModal>
      )}
    </article>
  );
}