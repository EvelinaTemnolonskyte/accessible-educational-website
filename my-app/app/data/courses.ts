import { Course } from '@/app/types/course';
import { TEST_QUESTIONS } from '@/app/data/testQuestions';

export const COURSES: Record<string, Course> = {
  '1': {
    id: '1',
    title: 'User Interface Design',
    lecturer: 'Prof. John Smith',
    image: '/courses/ui.png',
    topics: [
      { id: '1', number: 1, name: 'Usability Heuristics', description: 'An analytical exploration of Jakob Nielsen\'s foundational principles for human-computer interaction. ' },
    ],
    tests: [
      {
        id: '1',
        name: 'Midterm Test',
        description: 'Introduction to UI',
        durationSeconds: null, 
        status: 'not_started',
        attempts: 10, 
        maxSemesterPoints: 0.5,
      },
      {
        id: '2',
        name: 'Usability Heuristics',
        description: "Covers 10 Nielsen's heuristics.",
        durationSeconds: 1800, 
        status: 'not_started',
        attempts: null,
        maxSemesterPoints: 1.0,
      }
    ],
  },
  '2': {
    id: '2',
    title: 'Math',
    lecturer: 'Prof. Jane Doe',
    topics: [
      { 
        id: '1', 
        number: 1, 
        name: 'Discriminant', 
        description: 'Introduction to quadratic equations.' 
      }
    ],
    tests: [] 
  }
};

export function getCourse(id: string): Course | null {
  const course = COURSES[id];
  if (!course) return null;

  course.tests.forEach(test => {
    Object.defineProperty(test, 'questionCount', {
      get: function() {
        return TEST_QUESTIONS[this.id]?.length || 0;
      },
      enumerable: true,
      configurable: true
    });
  });

  return course;
}