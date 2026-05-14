export type TestStatus = 'not_started' | 'in_progress' | 'completed';
export type QuestionType = 'single' | 'multiple';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswers: number[];
  points: number;
}

export interface CourseTest {
  id: string;
  name: string;
  description?: string;
  questionCount?: number;
  durationSeconds: number | null; 
  status: TestStatus;
  attempts: number | null;
  score?: number;
  total?: number;
  questions?: Question[]; 
  maxSemesterPoints: number;
}

export interface CourseTopic {
  id: string;
  number: number;
  name: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  lecturer: string;
  image?: string;
  topics: CourseTopic[];
  tests: CourseTest[];
}

export interface TopicImage {
  src: string;
  alt: string;
}

export interface MathExpression {
  id: string;
  mathML: string;
  mathDescription: string; 
}
 
export interface ContentSection {
  id: string;           
  level: 2 | 3;         
  title: string;
  paragraphs: string[];
  images?: TopicImage[];
  sections?: ContentSection[]; 
  mathExpressions?: MathExpression[];
}
 
export interface TopicContent {
  topicName: string;           
  sections: ContentSection[];  
}