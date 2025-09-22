export interface Question {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaApiResponse {
  response_code: number;
  results: Question[];
}

export interface Quiz {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isCompleted: boolean;
}

export interface QuizSettings {
  amount: number;
  category?: string;
  difficulty?: string;
  type?: string;
}