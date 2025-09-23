import { Quiz } from "../models/quiz"
import { QuizSettings } from "../models/settings"

export interface IntoQuiz {
    intoQuiz(): Promise<Quiz>
}

export abstract class QuizApi implements IntoQuiz {
    readonly url: string

    protected constructor(url: string) {
        this.url = url
    }

    abstract intoQuiz(): Promise<Quiz>

    // Subclasses should override this static factory method.
    static from(settings: QuizSettings): QuizApi {
        throw new Error('QuizApi.from() must be implemented by subclasses')
    }
}