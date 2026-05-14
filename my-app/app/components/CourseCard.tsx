'use client';

import Link from 'next/link';
import { MoveRight } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  lecturer: string;
  href: string;
}

export default function CourseCard({ title, lecturer, href }: CourseCardProps) {
  return (
    <article
      style={{
        backgroundColor: 'var(--secondary-bg)',
        borderRadius: '20px',
        outline: '2px solid var(--blue-accent)',
        borderLeft: '6px solid var(--blue-accent)',
        padding: '1.25em 2em',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75em 1em',
      }}
    >
      <div style={{ minWidth: 0, flex: '1 1 200px' }}>
        <h2 style={{ margin: 0, overflowWrap: 'break-word' }}>
          {title}
        </h2>
        <p style={{ marginTop: '0.25em', overflowWrap: 'break-word' }}>
          Lecturer: {lecturer}
        </p>
      </div>

      <Link
        href={href}
        aria-label={`Go to course: ${title}, lecturer: ${lecturer}`}
        style={{
          whiteSpace: 'nowrap',
          flexShrink: 0,
          alignSelf: 'center',
          padding: '10px 20px',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        Go to Course <MoveRight size={20} aria-hidden="true" />
      </Link>
    </article>
  );
}