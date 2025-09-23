import { Quiz } from "../models/quiz"

export interface IntoQuiz {
    intoQuiz(): Promise<Quiz>
}

export interface QuizApi extends IntoQuiz {
    url: string
}