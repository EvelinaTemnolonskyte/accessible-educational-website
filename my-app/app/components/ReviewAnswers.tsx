'use client';
 
import { useRef } from 'react';
import { Question } from '@/app/types/course';
import { formatTimeSpent } from '@/app/utils/timeFormat';
import TestPageLayout from './TestPageLayout';
import CircularStat from './CirclularStat';
import { Check, X } from 'lucide-react';
 
interface ReviewAnswersProps {
  questions: Question[];
  userAnswers: Record<string, number[]>;
  testName: string;
  testId: string; 
  earnedPoints: number;
  totalPoints: number;
  timeSpentSeconds: number;
  timeLimitDisplay: string | null;
  completedAt: string;
  questionScores?: Record<string, number>;
}
 
type QuestionState = 'unanswered' | 'correct' | 'incorrect' | 'partial';
 
function getQuestionState(q: Question, userChoice: number[]): QuestionState {
  if (!userChoice || userChoice.length === 0) return 'unanswered';
  
  const correct = [...q.correctAnswers].sort().join(',');
  const user = [...userChoice].sort().join(',');
  
  if (correct === user) return 'correct';
 
  const correctSet = new Set(q.correctAnswers);
  const hasAtLeastOneCorrect = userChoice.some(a => correctSet.has(a));
 
  if (hasAtLeastOneCorrect) return 'partial';
  
  return 'incorrect';
}
 
function NavCircle({ idx, state, onClick }: { idx: number; state: QuestionState; onClick: () => void }) {
  const statusLabels: Record<QuestionState, string> = {
    unanswered: 'Unanswered',
    partial: 'Partially Correct',
    incorrect: 'Incorrect',
    correct: 'Correct',
  };
 
  const icons: Record<QuestionState, React.ReactNode> = {
    unanswered: null,
    partial: '~',
    incorrect: <X size={12} />,
    correct: <Check size={12} />,
  };
 
  const iconBorderColors: Record<QuestionState, string> = {
    unanswered: '', 
    partial: 'var(--main-text)', 
    incorrect: 'var(--secondary-bg)', 
    correct: 'var(--correct-border)',
  };
 
  const iconBackgroundColors: Record<QuestionState, string> = {
    unanswered: '', 
    partial: 'var(--main-text)', 
    incorrect: 'var(--wrong-accent)', 
    correct: 'var(--correct-bg)',
  };
  
  const iconSymbolColors: Record<QuestionState, string> = {
    unanswered: '', 
    partial: 'var(--secondary-bg)', 
    incorrect: 'var(--secondary-bg)', 
    correct: 'var(--correct-accent)',
  };
 
  const boxStyle: Record<QuestionState, React.CSSProperties> = {
    unanswered: { border: '3px dashed var(--main-text)', color: 'var(--main-text)' },
    partial: { border: '3px solid var(--main-text)', color: 'var(--main-text)', background: 'transparent' },
    incorrect: { border: '3px solid var(--wrong-accent)', background: 'var(--wrong-bg)', color: 'var(--wrong-accent)' },
    correct: { border: '3px solid var(--correct-border)', background: 'var(--correct-bg)', color: 'var(--correct-accent)' },
  };
 
  return (
    <button 
      onClick={onClick} 
      aria-label={`Go to Question ${idx + 1}: ${statusLabels[state]}`}
      style={{ 
        position: 'relative', 
        display: 'inline-block',
        background: 'none',
        border: 'none',
        padding: 0
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
        ...boxStyle[state],
      }}>
        {state === 'partial' && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '25%', background: 'var(--main-text)', borderRadius: '0 0 8px 8px',
          }} />
        )}
        <span aria-hidden="true" style={{ position: 'relative', zIndex: 1 }}>{idx + 1}</span>
      </div>
 
      {state !== 'unanswered' && (
        <span style={{
          position: 'absolute', top: '-8px', right: '-8px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: `${iconBackgroundColors[state]}`,
          border: `2px solid ${iconBorderColors[state]}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconSymbolColors[state], fontWeight: 'bold',
          zIndex: 2,
        }}>
          <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>{icons[state]}</span>
        </span>
      )}
    </button>
  );
}
 
export default function ReviewAnswers({
  questions, userAnswers, testName, testId, earnedPoints,
  totalPoints, timeSpentSeconds, timeLimitDisplay, completedAt, questionScores = {},
}: ReviewAnswersProps) {
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  
  const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
 
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };
 
  const scrollToQuestion = (idx: number) => {
    const element = document.getElementById(`review-q-${idx}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.focus();
    }
  };
 
  const header = (
    <>
      <div style={{ color: 'var(--white-bg)' }}>
        <h1 style={{ margin: '0 0 16px', color: 'var(--white-bg)' }}>
          Test {testId} : {testName}
        </h1>
        <div style={{ display: 'flex', gap: '48px'}}>
          <div>
            <div style={{marginBottom: '4px'}}>Completed</div>
            <time style={{ fontWeight: 'bold'}}>{formatDate(completedAt)}</time>
          </div>
          <div>
            <div style={{ marginBottom: '4px'}}>Time spent</div>
            <div style={{ fontWeight: 'bold'}}>{formatTimeSpent(timeSpentSeconds)}</div>
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
      <div style={{ padding: '44px'}}>
        <nav aria-label="Test Navigation" style={{ marginBottom: '32px', position: 'relative'}}>
          <button 
            onClick={() => questionsContainerRef.current?.focus()}
            className='skip-link'
          >
            Skip Navigation to Questions
          </button>
          
          <h2 style={{marginBottom: '14px' }}>
            Test Navigation
          </h2>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {questions.map((q, idx) => {
              const state = getQuestionState(q, userAnswers[q.id] || []);
              return (
                <NavCircle key={q.id} idx={idx} state={state} onClick={() => scrollToQuestion(idx)} />
              );
            })}
          </div>
        </nav>
 
        <div
          aria-hidden="true"
          style={{ 
            borderTop: '3px solid var(--blue-accent)', 
            width: 'calc(100% + 88px)', 
            marginLeft: '-44px',
            marginTop: '8px', 
            marginBottom: '32px' 
          }} 
        />
 
        <div 
          ref={questionsContainerRef}
          tabIndex={-1}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px', outline: 'none' }}
        >
          {questions.map((q, idx) => {
            const userChoice = userAnswers[q.id] || [];
            const correctSet = new Set(q.correctAnswers);
            const displayPoints = questionScores[q.id] ?? 0;
 
            return (
              <section
                id={`review-q-${idx}`}
                key={q.id}
                tabIndex={-1}
                role="region"
                aria-label={`Question ${idx + 1}`}
                style={{
                  borderRadius: '16px', border: '2px solid var(--blue-accent)',
                  padding: '24px', scrollMarginTop: '20px', outline: 'none'
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '14px',
                }}>
                  <span style={{ color: 'var(--main-text)'}}>
                    Question {idx + 1} / {questions.length}
                  </span>
                  <span style={{ color: 'var(--main-text)', fontSize:'1.25rem'}}>
                    <span style={{ color: 'var(--blue-accent)', fontSize:'1.25rem'}}>{displayPoints}</span> / {q.points} points
                  </span>
                </div>
 
                <h2 className='sr-only'>
                  Questions
                </h2>
 
                <h3 style={{marginBottom: '12px'}}>
                  {q.text}
                </h3>
 
                <p style={{marginBottom: '14px', fontWeight: 'bold' }}>
                  {q.type === 'multiple' ? 'Select all that apply' : 'Select one'}
                </p>
 
                <p className="sr-only">
                  This is a read-only review. Answers cannot be changed.
                </p>
 
                <fieldset
                  aria-disabled="true"
                  style={{ border: 'none', padding: 0, margin: 0 }}
                >
                  <legend className="sr-only">
                    {q.type === 'multiple' ? 'Multiple choice' : 'Single choice'} – read-only review
                  </legend>
 
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {q.options.map((opt, i) => {
                      const isCorrectAnswer = correctSet.has(i);
                      const isUserSelected = userChoice.includes(i);
                      const isWrongSelection = isUserSelected && !isCorrectAnswer;
 
                      let bg = 'var(--secondary-bg)';
                      let borderColor = 'var(--main-text)';
                      let textColor = 'var(--main-text)';
                      let Icon = null;
                      let accessibilityStatus = 'Not selected';
 
                      if (isCorrectAnswer) {
                        bg = 'var(--correct-bg)';
                        borderColor = 'var(--correct-border)';
                        textColor = 'var(--correct-accent)';
                        Icon = <Check size={16} />;
                        accessibilityStatus = 'Correct answer, not selected';
                      }
                      if (isWrongSelection) {
                        bg = 'var(--wrong-bg)';
                        borderColor = 'var(--wrong-accent)';
                        textColor = 'var(--wrong-accent)';
                        Icon = <X size={16} />;
                        accessibilityStatus = 'Your incorrect selection';
                      }
                      if (isUserSelected && isCorrectAnswer) {
                        accessibilityStatus = 'Your correct selection';
                      }
 
                      return (
                        <label
                          key={i}
                          role="presentation"
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '14px 18px', borderRadius: '12px',
                            border: `2px solid ${borderColor}`,
                            background: bg,
                            cursor: 'default',
                            pointerEvents: 'none',
                          }}
                        >
                          <input
                            type={q.type === 'multiple' ? 'checkbox' : 'radio'}
                            name={`review-q-${idx}`}
                            checked={isUserSelected}
                            onChange={() => {}}
                            tabIndex={-1}
                            aria-label={`${opt}. ${accessibilityStatus}`}
                            aria-disabled="true"
                            style={{
                              width: '18px', height: '18px', flexShrink: 0,
                              cursor: 'default',
                              pointerEvents: 'none',
                              accentColor: isWrongSelection
                                ? 'var(--wrong-accent)'
                                : isUserSelected && isCorrectAnswer
                                  ? 'var(--correct-accent)'
                                  : undefined,
                            }}
                          />
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontWeight: isCorrectAnswer || isWrongSelection ? 'bold' : 'normal',
                            color: textColor
                          }}>
                            {opt}
                            {Icon && <span aria-hidden="true" style={{ display: 'flex' }}>{Icon}</span>}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </section>
            );
          })}
        </div>
      </div>
    </TestPageLayout>
  );
}