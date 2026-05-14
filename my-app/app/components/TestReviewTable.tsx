'use client';

import { Question } from '@/app/types/course';
import { AlertCircle, MoveRight, Check } from 'lucide-react';

interface TestReviewTableProps {
  questions: Question[];
  userAnswers: Record<string, number[]>;
  onNavigateToQuestion: (index: number) => void;
}

const cellStyle: React.CSSProperties = {
  padding: '15px',
  border: '1px solid var(--main-text)',
  color: 'var(--main-text)'
};

export default function TestReviewTable({ 
  questions, 
  userAnswers, 
  onNavigateToQuestion 
}: TestReviewTableProps) {
  const answeredCount = questions.filter(q => (userAnswers[q.id] || []).length > 0).length;

  return (
    <div style={{ overflowX: 'auto' }}>
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite"
      >
        {answeredCount} questions answered.
      </div>

      <table 
        style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid var(--blue-accent)', marginBottom: '30px' }}
        aria-label="Test review summary"
      >
        <thead style={{ borderBottom: '2px solid var(--hero-border)' }}>
          <tr style={{ background: 'var(--blue-to-black)', color: 'var(--white-bg)' }}>
            <th scope="col" style={{ padding: '15px', width: '60px' }}>Nr.</th>
            <th scope="col" style={{ padding: '15px', textAlign: 'left' }}>Question & Answer</th>
            <th scope="col" style={{ padding: '15px', width: '160px' }}>Status</th>
            <th scope="col" style={{ padding: '15px', width: '180px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => {
            const answers = userAnswers[q.id] || [];
            const isAns = answers.length > 0;
            
            return (
              <tr key={q.id}>
                <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                <td style={cellStyle}>
                  <div style={{ color: 'var(--main-text)', marginBottom: '8px', fontWeight: 'bold' }}>{q.text}</div>
                  {isAns ? (
                    <div style={{ marginTop: '10px' }}>
                      <span style={{ color: 'var(--main-text)', display: 'block', marginBottom: '4px'}}>Your Answer:</span>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {answers.map(a => (
                          <li key={a} style={{ color: 'var(--blue-accent)', fontWeight: 'bold' }}>• {q.options[a]}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--main-text)', fontStyle: 'italic'}}>Not answered</div>
                  )}
                </td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>
                  <span 
                    style={{
                      color: isAns ? 'var(--blue-accent)' : 'var(--wrong-accent)',
                      background: isAns ? 'var(--completed-label-bg)' : 'var(--wrong-bg)',
                      border: '2px solid', borderColor: isAns ? 'var(--blue-accent)' : 'var(--wrong-accent)',
                      padding: '6px 12px', borderRadius: '15px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {isAns ? (
                      <><Check size={16} /> Answered</>
                    ) : (
                      <><AlertCircle size={16} /> Missing</>
                    )}
                  </span>
                </td>
                <td style={{ ...cellStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <button
                    onClick={() => onNavigateToQuestion(idx)}
                    aria-label={`Go to question ${idx + 1}`}
                    style={{
                      color: 'var(--blue-accent)', background: 'none', border: 'none',
                      textDecoration: 'underline',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '600'
                    }}
                  >
                    Go to question
                    <MoveRight size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}