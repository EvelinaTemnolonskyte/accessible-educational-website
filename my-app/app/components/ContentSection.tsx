'use client';
 
import { useEffect, useRef, useState } from 'react';
import { ContentSection as ContentSectionType } from '@/app/types/course';
import ListenButton from '@/app/components/ListenButton';
 
interface ContentSectionProps {
  section: ContentSectionType;
}
 
function MathExpression({
  mathML,
  id,
}: {
  mathML: string;
  mathDescription: string;
  id: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
 
  useEffect(() => {
    setIsMounted(true);
  }, []);
 
  useEffect(() => {
    if (!isMounted || !ref.current) return;
 
    const win = window as any;
    if (!win.MathJax) return;
 
    win.MathJax.startup.promise = win.MathJax.startup.promise
      .then(() => win.MathJax.typesetPromise([ref.current]))
      .catch(console.error);
  }, [isMounted, mathML]);

 
  if (!isMounted) {
    return <div id={id}/>;
  }
 
  return (
    <div
      ref={ref}
      id={id}
      dangerouslySetInnerHTML={{ __html: mathML }}
    />
  );
}

export default function ContentSection({ section }: ContentSectionProps) {
  const formulasDescription = section.mathExpressions
    ?.map(exp => `. Formula: ${exp.mathDescription}`)
    .join(' ') ?? '';
 
  const fullText = section.title + '. ' + section.paragraphs.join(' ') + formulasDescription;
 
  return (
    <section 
      id={section.id} 
      data-section
      aria-labelledby={`heading-${section.id}`} 
      style={{ marginBottom: '48px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <h2 id={`heading-${section.id}`} style={{ outline: 'none' }}>{section.title}</h2>
        <ListenButton sectionId={section.id} sectionTitle={section.title} text={fullText} />
      </div>
 
      {section.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      {section.images?.map((img, i) => (
        <div 
          key={i} 
          role="region"
          aria-label={`Image ${i + 1}: ${img.alt}`}
          style={{ 
            margin: '24px 0', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '100%'
          }}
        >
          <img 
            src={img.src} 
            alt={img.alt} 
            style={{ 
              maxWidth: '100%', 
              borderRadius: '15px', 
              border: '3px solid var(--blue-accent)' 
            }} 
          />
        </div>
      ))}

      {section.mathExpressions?.map(expr => (
        <MathExpression
          key={expr.id}
          id={expr.id}
          mathML={expr.mathML}
          mathDescription={expr.mathDescription}
        />
      ))}
 
      {section.sections?.map(child => (
        <ContentSection key={child.id} section={child} />
      ))}
    </section>
  );
}