import { Question } from '../types/course';

export const TEST_QUESTIONS: Record<string, Question[]> = {
  '1': [
    {
      id: 'q1',
      text: 'What is the primary difference between a heuristic evaluation and a formal usability test?',
      type: 'single',
      options: [
        'Heuristic evaluation requires a large group of end-users.',
        'Heuristic evaluation is conducted by experts using recognized principles.',
        'Usability testing does not require any human participants.',
        'There is no difference; they are two names for the same process.'
      ],
      correctAnswers: [1],
      points: 1
    },
    {
      id: 'q2',
      text: 'Which of the following are required according to WCAG 2.1 guidelines to ensure accessibility for users with visual impairments?',
      type: 'multiple',
      options: [
        'Alternative texts (alt) for informative images.',
        'Animations on every page for better visual appeal.',
        'Sufficient color contrast ratio between text and background.',
        'Keyboard navigation support without requiring a mouse.',
        'Color as the only means of conveying information.'
      ],
      correctAnswers: [0, 2, 3],
      points: 2
    }
  ],
  '2': [
    {
      id: 'q1',
      text: 'Which of the following are good examples of system status visibility?',
      type: 'multiple',
      options: ['An upload progress bar', 'A "Loading..." spinner', 'A hidden background process', 'A breadcrumb showing the current page location.'],
      correctAnswers: [0, 1, 3],
      points: 3
    },
    {
      id: 'q2',
      text: "Which of the following design elements are examples of the 'Recognition Rather Than Recall' heuristic?",
      type: 'multiple',
      options: ['A "Recently Viewed Items" section in an e-commerce app.', 'A persistent visible menu bar that shows available navigation options.', 'A detailed 404 error page that explains why a link is broken.', 'An advanced search filter that requires users to type specific command codes.'],
      correctAnswers: [0, 1],
      points: 2
    },
    {
      id: 'q3',
      text: 'A user returns to an e-commerce website after a week... Which Nielsen heuristic is applied?',
      type: 'single',
      options: ['User Control and Freedom', 'Match Between System and the Real World', 'Recognition Rather Than Recall', 'Aesthetic and Minimalist Design'],
      correctAnswers: [2],
      points: 1
    },
    {
      id: 'q4',
      text: 'Which heuristic emphasizes that users should always be informed about what is going on?',
      type: 'single',
      options: ['Match between system and the real world', 'Visibility of system status', 'User control and freedom'],
      correctAnswers: [1],
      points: 1
    }
  ]
};