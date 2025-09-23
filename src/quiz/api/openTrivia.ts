import axios from "axios"

import { QuizApi } from "../rules/quiz"
import { AnswerOptions, Question, Quiz } from "../models/quiz"

export type Difficulty = 'easy' | 'medium' | 'hard'

export enum Category {
    General = 9,
    Books = 10,
    Film = 11,
    Music = 12,
    MusicalsAndTheatres = 13,
    Television = 14,
    VideoGames = 15,
    BoardGames = 16,
    ScienceAndNature = 17,
    Computers = 18,
    Mathematics = 19,
    Mythology = 20,
    Sports = 21,
    Geography = 22,
    History = 23,
    Politics = 24,
    Art = 25,
    Celebrities = 26,
    Animals = 27,
    Vehicles = 28,
    Comics = 29,
    Gadgets = 30,
    JapaneseCulture = 31,
    Cartoon = 32,
}   

export type Options = {
    amount: number
    category: Category
    difficulty: Difficulty
}


// -------- Internal --------

enum OpenTriviaCode {
    Success = 0,
    ManyQuestions = 1,
    InvalidParameter = 2,
    SessionNotFound = 3,
    ResetSessionRequired = 4,
    RateLimit = 5
}

type OpenTriviaResult = {
    type: 'multiple' | 'boolean'
    diffculty: 'easy' | 'medium' | 'hard'
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

type OpenTriviaResponse = {
    response_code: OpenTriviaCode
    results: OpenTriviaResult[]
}

const httpOkStatus = 200

class OpenTriviaApi implements QuizApi {
    readonly url: string = "https://opentdb.com/api.php"
    readonly options: Options

    static from(options: Options): OpenTriviaApi {
        return new this(options)
    }

    async intoQuiz(): Promise<Quiz> {
        const response = await this.fetch()
        const questions = response.results.map((result) => Question.create({
            question: result.question,
            options: new AnswerOptions(
                result.correct_answer, 
                result.incorrect_answers
            )
        }))
        return Quiz.create({questions})
    }


    private constructor(options: Options) {
        this.options = options
    }

    private async fetch(): Promise<OpenTriviaResponse> {
        const url = this.urlFrom(this.options)
        const response = await axios.get(url)

        if (response.status != httpOkStatus) {
            throw new Error(`Failed to fetch OpenTDB : ${response.statusText}`)
        }

        return response.data as OpenTriviaResponse
    }

    private urlFrom(options: Options): string {
        const params = new URLSearchParams()
        params.set('amount', String(options.amount))
        params.set('category', String(options.category.valueOf()))
        params.set('dificulty', options.difficulty)
        return `${this.url}?${params}`
    }

}

