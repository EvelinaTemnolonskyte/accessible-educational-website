import { TopicContent } from '@/app/types/course';
 
export const UI_DESIGN_TOPIC_1: TopicContent = {
  topicName: 'Usability Heuristics',
  sections: [
    {
      id: 'what-are-heuristics',
      level: 2,
      title: 'What are heuristics?',
      paragraphs: [
        "The word \"heuristic\" comes from the Greek word meaning \"to find\" or \"to discover.\" In the context of usability, heuristics are rules of thumb – practical guidelines derived from experience and research that help predict whether an interface will be easy to use.",
        "Unlike formal usability testing, heuristic evaluation does not require users – it is conducted by expert evaluators who inspect the interface and judge its compliance with recognised usability principles. That makes them especially useful when time, budget, or access to users is limited.",
      ],
    },
    {
      id: 'nielsens-heuristics',
      level: 2,
      title: "10 Nielsen's Heuristics",
      paragraphs: [
        "The most widely used set of usability heuristics was created by Jakob Nielsen in 1994. Even 30 years later, these 10 heuristics are still relevant because they're grounded in human psychology. Now let's dive into the specifics.",
      ],
      sections: [
        {
          id: 'visibility-of-system-status',
          level: 3,
          title: '1. Visibility of system status',
          paragraphs: [
            "Effective interface design necessitates that users remain continuously informed of system states through timely and contextually appropriate feedback mechanisms. Common implementations of this principle include progress indicators during file transfer operations, loading animations during page rendering, and confirmation notifications following form submission — each serving to communicate that the user's input has been successfully processed. Access to real-time system status information enables users to evaluate the outcomes of their interactions and make informed decisions regarding subsequent actions. Furthermore, predictable and transparent system behaviour fosters a sense of reliability, thereby strengthening user trust in both the product and the broader brand.",
            "In WeTransfer, while transferring the files it will show the circular progress bar along with the percentage as the first feedback and after finish transferring, it will reflect the status by saying “You’re done!” which meansit acknowledging the user that your files have been transferred successfully.",
          ],
          images: [
            {
              src: '/topics/wetransfer_example.png',
              alt: 'WeTransfer progress bar and completion screen demonstrating system status feedback',
            },
          ],
        },
        {
          id: 'match-system-real-world',
          level: 3,
          title: '2. Match between system and the real world',
          paragraphs: [
            "Matching between the system and the real world refers to designing interfaces that align with the language, concepts, and conventions already familiar to users. Rather than relying on system-oriented terminology or abstract representations, this principle emphasises the importance of communicating through terms, icons, and workflows that reflect how users naturally think and behave in their everyday lives. By mirroring real-world conventions, interfaces become more intuitive, effectively minimising the learning curve and reducing the potential for confusion.",
            "This alignment manifests in various ways across interface design: the use of recognisable icons such as a trash can to represent item deletion, the structuring of workflows to mirror real-world processes such as an e-commerce checkout sequence modelled on in-store purchasing steps, and the presentation of information in a logical, culturally appropriate order — for instance, adapting date formats and measurement units to match the user's regional context.",
            "A compelling example of this principle in practice is the iPhone's compass application, which replicates the visual appearance and behaviour of a physical compass. By drawing on users' pre-existing understanding of how a real compass operates, the application requires virtually no instruction, allowing users to engage with it immediately and confidently."
          ],
          images: [
            {
              src: '/topics/iphone_compass_example.png',
              alt: 'iPhone compass app alongside a physical compass demonstrating real-world design matching',
            },
          ],
        },
      ],
    },
  ],
};

export const MATH_TOPIC_1: TopicContent = {
  topicName: 'Mathematical Fundamentals',
  sections: [
    {
      id: 'dicriminant-section',
      level: 2,
      title: 'Discriminant',
      paragraphs: [
        "In mathematics, the discriminant of a polynomial is a quantity that depends on the coefficients and allows deducing some properties of the roots without computing them. More precisely, it is a polynomial function of the coefficients of the original polynomial. The discriminant is widely used in polynomial factoring, number theory, and algebraic geometry.",
        "The discriminant of the quadratic polynomial is:"
      ],
      mathExpressions: [
        {
          id: 'eq-1',
          mathML: `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
                    <mrow>
                      <mi>x</mi>
                      <mo>=</mo>
                      <mfrac>
                        <mrow>
                          <mo>&#x2212;</mo>
                          <mi>b</mi>
                          <mo>&#x00B1;</mo>
                          <msqrt>
                            <mi>D</mi>
                          </msqrt>
                        </mrow>
                        <mrow>
                          <mn>2</mn>
                          <mi>a</mi>
                        </mrow>
                      </mfrac>
                    </mrow>
                  </math>`,
          mathDescription: 'x equals minus b plus or minus the square root of D, all divided by 2 a',
        },
      ],
    },
  ],
};
 
export const TOPIC_CONTENT_MAP: Record<string, Record<string, TopicContent>> = {
  '1': {
    '1': UI_DESIGN_TOPIC_1,
  },
  '2': {
    '1': MATH_TOPIC_1,
  },
};
 
 
export function getTopicContent(courseId: string, topicId: string): TopicContent | null {
  return TOPIC_CONTENT_MAP[courseId]?.[topicId] ?? null;
}