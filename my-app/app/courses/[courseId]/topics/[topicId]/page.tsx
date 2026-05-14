import TopicPageClient from '@/app/components/TopicPageClient';
import { Metadata } from 'next';
import { getCourse } from '@/app/data/courses';

interface PageProps {
  params: Promise<{ courseId: string; topicId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseId, topicId } = await params;
  const course = getCourse(courseId);
  const topic = course?.topics.find(t => t.id === topicId);
  return {
    title: topic ? `${topic.name} | UniVerse` : 'Topic Details',
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { courseId, topicId } = await params;
  return <TopicPageClient courseId={courseId} topicId={topicId} />;
}