export const QUIZ_DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const QUIZ_QUESTION_TYPES = ["multiple-choice", "true-false", "short-answer"] as const;
export const QUIZ_QUESTION_COUNTS = [5, 10, 15, 20] as const;

export type QuizDifficulty = (typeof QUIZ_DIFFICULTIES)[number];
export type QuizQuestionType = (typeof QUIZ_QUESTION_TYPES)[number];

export interface QuizOption {
  label: string;
  text: string;
}

export interface QuizQuestion {
  question: string;
  type: QuizQuestionType;
  options?: QuizOption[]; // multiple-choice only
  answer: string;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface GenerateQuizRequest {
  summaryId: string;
  difficulty: QuizDifficulty;
  questionType: QuizQuestionType;
  questionCount: number;
}

export interface SavedQuiz {
  id: string;
  document_id: string;
  difficulty: string;
  content: Quiz;
  created_at: string;
  score: number | null;  // ← เพิ่ม
  total: number | null;  // ← เพิ่ม
}

// Request body สำหรับ PATCH /api/quiz
export interface SaveQuizScoreRequest {
  quizId: string;
  score: number;
  total: number;
}