import axios from 'axios';
import { TriviaApiResponse, QuizSettings } from '@/types/quiz';

const TRIVIA_API_BASE_URL = 'https://opentdb.com/api.php';

export const triviaApi = axios.create({
  baseURL: TRIVIA_API_BASE_URL,
  timeout: 10000,
});

export const fetchQuestions = async (settings: QuizSettings): Promise<TriviaApiResponse> => {
  const params = new URLSearchParams({
    amount: settings.amount.toString(),
  });

  if (settings.category) {
    params.append('category', settings.category);
  }

  if (settings.difficulty) {
    params.append('difficulty', settings.difficulty);
  }

  if (settings.type) {
    params.append('type', settings.type);
  }

  const response = await triviaApi.get<TriviaApiResponse>(`?${params.toString()}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await triviaApi.get('https://opentdb.com/api_category.php');
  return response.data;
};