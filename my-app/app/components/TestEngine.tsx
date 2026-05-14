'use client';
 
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Question } from '@/app/types/course';
import { useParams } from 'next/navigation';
import { formatDuration } from '@/app/utils/timeFormat';
import BaseModal from './BaseModal';
import TestReviewTable from './TestReviewTable';
import TestPageLayout from './TestPageLayout';
import { MoveRight, AlertCircle } from 'lucide-react';
 
interface Props {
  questions: Question[];
  testName: string;
  testId: string;
  duration: number | null;
  maxAttempts: number | null;
  retakeKey?: number;
  onComplete: (result: {
    earnedPoints: number;
    totalPoints: number;
    timeSpentSeconds: number;
    userAnswers: Record<string, number[]>;
  }) => void;
}
 
export default function TestEngine({
  questions,
  testName,
  testId,
  duration,
  retakeKey = 0,
  onComplete
}: Props) {
  const params = useParams();

  const skipLinkRef = useRef<HTMLButtonElement>(null); 
  const navContainerRef = useRef<HTMLElement>(null);
  const questionSectionRef = useRef<HTMLElement>(null);
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null);

  const PROGRESS_KEY = `test_progress_${params.courseId}_${testName}`;
  const ATTEMPTS_KEY = `test_attempts_count_${params.courseId}_${testName}`;
  const RESULT_KEY = `test_result_${params.courseId}_${testName}`;
  const ANSWERS_KEY = `test_useranswers_${params.courseId}_${testName}`;
  const COMPLETION_FLAG_KEY = `test_completed_flag_${params.courseId}_${testName}`;
  const QUESTION_SCORES_KEY = `test_question_scores_${params.courseId}_${testName}`;
 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [timeAnnouncement, setTimeAnnouncement] = useState('');
 
  const startTimeRef = useRef<number>(Date.now());
  const endTimeRef = useRef<number | null>(null);
  const hasSubmittedRef = useRef(false);
  const userAnswersRef = useRef<Record<string, number[]>>({});
 
  useEffect(() => {
    hasSubmittedRef.current = false;
    setIsInitialized(false);
    setCurrentIdx(0);
    setIsReviewMode(false);
 
    const used = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0');
    setAttemptsUsed(used);
 
    const saved = retakeKey === 0 ? localStorage.getItem(PROGRESS_KEY) : null;
 
    if (saved) {
      const parsed = JSON.parse(saved);
      
      if (parsed.pending || !parsed.startTime) {
        const now = Date.now();
        startTimeRef.current = now;
        endTimeRef.current = duration ? now + (duration * 1000) : null;
        setUserAnswers({});
        userAnswersRef.current = {};
        
        localStorage.setItem(PROGRESS_KEY, JSON.stringify({
          answers: {},
          startTime: startTimeRef.current,
          endTime: endTimeRef.current,
        }));
      } else {
        const answers = parsed.answers || {};
        setUserAnswers(answers);
        userAnswersRef.current = answers;
        startTimeRef.current = parsed.startTime;
        endTimeRef.current = parsed.endTime || (duration ? startTimeRef.current + (duration * 1000) : null);
      }
    } else {
      const now = Date.now();
      const newEndTime = duration ? now + (duration * 1000) : null;
 
      setUserAnswers({});
      userAnswersRef.current = {};
      startTimeRef.current = now;
      endTimeRef.current = newEndTime;
 
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({
        answers: {},
        startTime: now,
        endTime: newEndTime,
      }));

      window.dispatchEvent(new CustomEvent('test-completed-sync', {
        detail: { courseId: params.courseId, testName: testName, started: true }
      }));
    }
 
    setIsInitialized(true);
  }, [retakeKey, duration, PROGRESS_KEY, ATTEMPTS_KEY, RESULT_KEY, params.courseId, testName]);

  useEffect(() => {
    if (!isInitialized) return;
 
    const msg = document.createElement('div');
    msg.setAttribute('aria-live', 'assertive');
    msg.setAttribute('role', 'status');
    msg.className = 'sr-only';
    document.body.appendChild(msg);
 
    const timeout = setTimeout(() => {
      msg.textContent = `Test ${testName} opened`;
    }, 100);
 
    return () => {
      clearTimeout(timeout);
      document.body.removeChild(msg);
    };
  }, [isInitialized, testName]);

  useEffect(() => {
    if (isInitialized) {
      if (isReviewMode) {
        reviewHeadingRef.current?.focus();
      } else {
        questionSectionRef.current?.focus();
      }
    }
  }, [currentIdx, isReviewMode, isInitialized]);
 
  useEffect(() => {
    if (isInitialized && !hasSubmittedRef.current) {
      userAnswersRef.current = userAnswers;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({
        answers: userAnswers,
        startTime: startTimeRef.current,
        endTime: endTimeRef.current,
      }));
    }
  }, [userAnswers, isInitialized, PROGRESS_KEY]);
 
  useEffect(() => {
    if (!isInitialized || !endTimeRef.current) return;
 
    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTimeRef.current! - now) / 1000));
      setTimeLeft(remaining);
 
      if (remaining > 0) {
        if (remaining <= 10) {
          setTimeAnnouncement(`${remaining}`);
        } else if (remaining <= 60 && remaining % 10 === 0) {
          setTimeAnnouncement(`Time remaining: ${formatDuration(remaining)}`);
        } else if (remaining % 60 === 0) {
          setTimeAnnouncement(`Time remaining: ${formatDuration(remaining)}`);
        }
      }
 
      if (remaining <= 0 && !hasSubmittedRef.current) {
        handleFinalSubmit(true);
      }
    };
 
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [isInitialized]);

  const answeredCount = Object.values(userAnswers).filter(a => a.length > 0).length;

  const submitModal = useMemo(() => {
    if (!showSubmitModal) return null;
    return (
      <BaseModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={() => handleFinalSubmit(false)}
        title="Submit Test Answers?"
        subtitle={testName}
        confirmText="Submit Test"
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
          <div style={{ flex: 1, padding: '15px', borderRadius: '15px', border: '3px solid var(--blue-accent)', background: 'var(--completed-label-bg)', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--blue-accent)', fontSize: '24px' }}>{answeredCount}</div>
            <div style={{ fontWeight: 'bold', color: 'var(--blue-accent)' }}>Answered</div>
          </div>
          <div style={{ flex: 1, padding: '15px', borderRadius: '15px', border: '3px solid var(--wrong-accent)', background: 'var(--wrong-bg)', textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'var(--secondary-bg)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={38} style={{ color: 'var(--wrong-accent)' }} aria-hidden="true" />
            </div>
            <div style={{ fontWeight: 'bold', color: 'var(--wrong-accent)', fontSize: '24px' }}>{questions.length - answeredCount}</div>
            <div style={{ fontWeight: 'bold', color: 'var(--wrong-accent)' }}>Not answered</div>
          </div>
        </div>
        <p style={{ color: 'var(--main-text)', textAlign: 'center' }}>Once submitted, you cannot change your answers.</p>
      </BaseModal>
    );
  }, [showSubmitModal, answeredCount, questions.length, testName]);
 
  const calcEarnedPoints = (q: Question, userChoice: number[]): number => {
    if (q.type === 'single') {
      const correct = [...q.correctAnswers].sort().join(',');
      const user = [...userChoice].sort().join(',');
      return correct === user ? q.points : 0;
    }
    const correctSet = new Set(q.correctAnswers);
    const numCorrect = q.correctAnswers.length;
    const pointPerOption = q.points / numCorrect;
    let earned = 0;
    userChoice.forEach(i => {
      if (correctSet.has(i)) earned += pointPerOption;
      else earned -= pointPerOption;
    });
    return Math.max(0, Math.round(earned * 100) / 100);
  };
 
  const handleFinalSubmit = (isTimeout: boolean = false) => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
 
    const answers = userAnswersRef.current;
    let totalPoints = 0;
    let earnedPoints = 0;
    const questionScores: Record<string, number> = {};
 
    questions.forEach(q => {
      totalPoints += q.points;
      const userChoice = answers[q.id] || [];
      const qEarned = calcEarnedPoints(q, userChoice);
      earnedPoints += qEarned;
      questionScores[q.id] = qEarned;
    });
 
    let timeSpentSeconds: number;
    if (duration && (isTimeout || timeLeft === 0)) {
      timeSpentSeconds = duration;
    } else {
      timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (duration && timeSpentSeconds > duration) timeSpentSeconds = duration;
    }
 
    const nextAttempt = (attemptsUsed || 0) + 1;
    const completed = { 
      earnedPoints, 
      totalPoints, 
      timeSpentSeconds, 
      userAnswers: answers,
      attemptNumber: nextAttempt,
      completedAt: new Date().toISOString()
    };
 
    localStorage.setItem(RESULT_KEY, JSON.stringify(completed));
    localStorage.setItem(ATTEMPTS_KEY, nextAttempt.toString());
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
    localStorage.setItem(QUESTION_SCORES_KEY, JSON.stringify(questionScores));
    localStorage.setItem(COMPLETION_FLAG_KEY, 'true');
 
    window.dispatchEvent(new CustomEvent('test-completed-sync', {
      detail: { 
        courseId: params.courseId, 
        testName: testName, 
        result: completed,
        timestamp: Date.now() 
      }
    }));
 
    localStorage.removeItem(PROGRESS_KEY);
    onComplete({ earnedPoints, totalPoints, timeSpentSeconds, userAnswers: answers });
  };
 
  const handleSelection = (optionIdx: number) => {
    const q = questions[currentIdx];
    setUserAnswers(prev => {
      const existing = prev[q.id] || [];
      let next: Record<string, number[]>;
      if (q.type === 'single') {
        next = { ...prev, [q.id]: [optionIdx] };
      } else {
        next = {
          ...prev,
          [q.id]: existing.includes(optionIdx) ? existing.filter(i => i !== optionIdx) : [...existing, optionIdx],
        };
      }
      userAnswersRef.current = next;
      return next;
    });
  };
 
  if (!isInitialized) return null;
 
  const currentQuestion = questions[currentIdx];
 
  const header = (
    <>
      <h1 style={{ margin: 0, color: 'var(--white-bg)' }}>Test {testId}: {testName}</h1>
      {duration !== null && (
        <div role="timer" aria-label="Countdown timer" style={{ textAlign: 'center' }}>
          <div style={{fontWeight: 'bold', marginBottom: '4px', color: 'var(--white-bg)' }}>Time left</div>
          <div style={{
            background: 'var(--secondary-bg)',
            color: 'var(--sections-text)',
            border: '5px solid var(--blue-buttons-border)',
            padding: '10px 20px',
            borderRadius: '15px',
            fontWeight: 'bold',
            minWidth: '160px',
          }}>
            {formatDuration(timeLeft)}
          </div>
        </div>
      )}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {timeAnnouncement}
      </div>
    </>
  );
 
  return (
    <>
      <TestPageLayout header={header}>
        <div style={{ minHeight: '500px', position: 'relative' }}>
          {!isReviewMode ? (
            <>
              <nav 
                ref={navContainerRef}
                tabIndex={-1}
                aria-label="Question navigation" 
                style={{ padding: '40px 40px 30px', outline: 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      aria-label={`Go to Question ${idx + 1}`}
                      aria-current={currentIdx === idx ? 'step' : undefined}
                      style={{
                        width: '40px', height: '40px', borderRadius: '15px', cursor: 'pointer',
                        border: currentIdx === idx ? '3px solid var(--blue-buttons-border)' : '3px solid var(--main-text)',
                        background: currentIdx === idx ? 'var(--primary)' : 'none',
                        color: currentIdx === idx ? 'var(--white-bg)' : 'var(--main-text)',
                      }}
                    >{idx + 1}</button>
                  ))}
                </div>
              </nav>
 
              <div aria-hidden="true" style={{ borderTop: '3px solid var(--blue-accent)', width: '100%' }} />
 
              <section 
                ref={questionSectionRef}
                tabIndex={-1}
                aria-labelledby="question-heading" 
                style={{ padding: '30px 40px 40px', position: 'relative', outline: 'none' }}
              >
                <button 
                  ref={skipLinkRef}
                  onClick={() => navContainerRef.current?.focus()}
                  className='skip-link'
                >
                  Go to Test Navigation
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <p 
                    id="question-heading" 
                    style={{ fontWeight: 'bold', margin: 0 }}
                  >
                    Question {currentIdx + 1} of {questions.length}
                  </p>
                  <span style={{
                    border: '2px solid var(--blue-accent)', borderRadius: '20px',
                    padding: '4px 16px', color: 'var(--blue-accent)', background:'var(--completed-label-bg)',
                  }}>Worth: {currentQuestion.points} points</span>
                </div>
                
                <h2 style={{ marginBottom: '30px'}}>{currentQuestion.text}</h2>
                
               <fieldset 
                  style={{ border: 'none', padding: 0, margin: 0 }}
                  aria-label={currentQuestion.type === 'multiple' ? 'Answer\'s options, select all that apply' : 'Answer\s options, select one'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentQuestion.options.map((option, i) => {
                      const isSelected = userAnswers[currentQuestion.id]?.includes(i);
                      return (
                        <label key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '15px',
                          padding: '18px 24px', borderRadius: '16px', border: '2px solid',
                          borderColor: isSelected ? 'var(--blue-accent)' : 'var(--main-text)',
                          cursor: 'pointer',
                        }}>
                          <input
                            type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'}
                            name={`question-${currentQuestion.id}`}
                            checked={isSelected || false}
                            onChange={() => handleSelection(i)}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--blue-accent)' }}
                          />
                          <span style={{ fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? 'var(--blue-accent)' : 'var(--main-text)' }}>
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
 
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
                  {currentIdx > 0 ? (
                    <button 
                      onClick={() => setCurrentIdx(prev => prev - 1)} 
                      className='action-btn secondary-btn'
                    >
                      <MoveRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back
                    </button>
                  ) : <div />}
                  <button 
                    onClick={() => currentIdx === questions.length - 1 ? setIsReviewMode(true) : setCurrentIdx(prev => prev + 1)} 
                    className = 'action-btn primary-btn'
                  >
                    {currentIdx === questions.length - 1 ? 'Review & Submit' : 'Next →'}
                  </button>
                </div>
              </section>
            </>
          ) : (
            <section aria-labelledby="review-heading" style={{ padding: '40px' }}>
              <h2 
                ref={reviewHeadingRef}
                id="review-heading" 
                tabIndex={-1}
                style={{ textAlign: 'center', marginBottom: '30px'}}
              >
                Review Answers
              </h2>
              <TestReviewTable questions={questions} userAnswers={userAnswers} onNavigateToQuestion={(idx) => { setIsReviewMode(false); setCurrentIdx(idx); }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <button onClick={() => setIsReviewMode(false)} className='action-btn secondary-btn'> 
                   <MoveRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back
                </button>
                <button onClick={() => setShowSubmitModal(true)} className='action-btn primary-btn'>Submit Test</button>
              </div>
            </section>
          )}
        </div>
      </TestPageLayout>
 
      {submitModal}
    </>
  );
}