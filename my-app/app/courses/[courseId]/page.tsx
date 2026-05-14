import CourseDetailPage from '@/app/components/CourseDetailPage';
import { Metadata } from 'next';
import { getCourse } from '@/app/data/courses';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = getCourse(courseId);
  return {
    title: course ? `${course.title} | UniVerse` : 'Course Details',
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { courseId } = await params;
  return <CourseDetailPage courseId={courseId} />;
}