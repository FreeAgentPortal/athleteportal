export interface QuestionPrompt {
  id: string;
  category: string;
  question: string;
}

export const PROSPECT_QUESTIONS: QuestionPrompt[] = [
  // PERSONALITY & CHARACTER
  {
    id: 'personality-upbringing',
    category: 'Personality & Character',
    question: 'Tell us about your upbringing. Parents? What was your childhood like?',
  },
  {
    id: 'personality-family',
    category: 'Personality & Character',
    question: 'Are you married, or do you have kids?',
  },
  {
    id: 'personality-legal',
    category: 'Personality & Character',
    question: 'Have you ever been in trouble with the law or suspended in school or athletics?',
  },
  {
    id: 'personality-adversity',
    category: 'Personality & Character',
    question: 'How do you handle adversity and criticism?',
  },
  {
    id: 'personality-role-model',
    category: 'Personality & Character',
    question: 'Who was your role model, and why?',
  },
  {
    id: 'personality-hobbies',
    category: 'Personality & Character',
    question: 'What do you do in your free time? Any hobbies or interests outside football?',
  },

  // FOOTBALL IQ & PREPARATION
  {
    id: 'football-preparation',
    category: 'Football IQ & Preparation',
    question: 'Walk us through your weekly preparation before a game.',
  },
  {
    id: 'football-system',
    category: 'Football IQ & Preparation',
    question: "What is your understanding of your team's offensive/defensive system?",
  },
  {
    id: 'football-film',
    category: 'Football IQ & Preparation',
    question: 'How do you study film, and what do you look for?',
  },
  {
    id: 'football-coverage',
    category: 'Football IQ & Preparation',
    question: "What's your favorite coverage/concept to run and why?",
  },

  // WORK ETHIC & COMPETITIVENESS
  {
    id: 'work-criticism',
    category: 'Work Ethic & Competitiveness',
    question: 'How do you respond when a coach calls you out in front of the team?',
  },
  {
    id: 'work-hardest',
    category: 'Work Ethic & Competitiveness',
    question: "What's the hardest you've ever worked for something?",
  },
  {
    id: 'work-love-football',
    category: 'Work Ethic & Competitiveness',
    question: 'Do you love football, or do you just like what football brings you?',
  },
  {
    id: 'work-best-player',
    category: 'Work Ethic & Competitiveness',
    question: "Who is the best player you've ever gone up against, and how did you perform?",
  },
  {
    id: 'work-separates',
    category: 'Work Ethic & Competitiveness',
    question: 'What separates you from other players at your position?',
  },

  // TEAM FIT & ACCOUNTABILITY
  {
    id: 'team-conflict',
    category: 'Team Fit & Accountability',
    question: 'Have you ever had a conflict with a teammate or coach? How did you handle it?',
  },
  {
    id: 'team-role',
    category: 'Team Fit & Accountability',
    question: 'What role did you play in the locker room—leader, follower, enforcer, etc.?',
  },
  {
    id: 'team-coach-reference',
    category: 'Team Fit & Accountability',
    question: 'If we called your position coach today, what would he say about you?',
  },
  {
    id: 'team-rotation',
    category: 'Team Fit & Accountability',
    question: 'How do you handle being part of a rotation or not being the starter?',
  },
];

export const QUESTION_CATEGORIES = ['Personality & Character', 'Football IQ & Preparation', 'Work Ethic & Competitiveness', 'Team Fit & Accountability'] as const;
