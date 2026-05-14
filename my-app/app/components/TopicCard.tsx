'use client';
 
import Link from 'next/link';
import { MoveRight } from 'lucide-react'; 
import { CourseTopic } from '@/app/types/course';
 
interface TopicCardProps {
  topic: CourseTopic;
  courseId: string; 
}
 
const cardStyle: React.CSSProperties = {
  background: 'var(--primary)',
  border: '3px solid var(--blue-accent)',
  borderRadius: '20px',
  overflow: 'hidden',
  flex: '1 1 calc(50% - 10px)',
  minWidth: '260px',
  display: 'flex',
  flexDirection: 'column',
};
 
const headerStyle: React.CSSProperties = {
  background: 'var(--blue-to-black)',
  borderBottom: '3px solid var(--blue-accent)',
  padding: '12px 20px',
  fontWeight: 'bold',
  fontSize: '1.25rem',
  color: '#F5F7FA',
  textAlign: 'center',
};
 
const bodyStyle: React.CSSProperties = {
  background: 'var(--secondary-bg)',
  borderRadius: '0 0 14px 14px',
  padding: '16px 20px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  flexGrow: 1,
};
 
const descStyle: React.CSSProperties = {
  color: 'var(--main-text)',
  fontWeight: 'bold',
};
 
const linkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  marginTop: 'auto',
  alignSelf: 'flex-end',
  paddingTop: '12px'
};
 
export default function TopicCard({ topic, courseId }: TopicCardProps) {
  return (
    <article 
      style={cardStyle}
      aria-labelledby={`topic-header-${topic.id}`}
    >
      <div id={`topic-header-${topic.id}`} style={headerStyle}>
        Topic {topic.number}
      </div>
      <div style={bodyStyle}>
        <h3 style={{ margin: '0 0 8px' }}>{topic.name}</h3>
        <p style={descStyle}>{topic.description}</p>
 
        <Link
          href={`/courses/${courseId}/topics/${topic.id}`}
          style={linkStyle}
          aria-label={`View content for Topic ${topic.number}: ${topic.name}`}
        >
          View content
          <MoveRight size={16} aria-hidden="true" /> 
        </Link>
      </div>
    </article>
  );
}