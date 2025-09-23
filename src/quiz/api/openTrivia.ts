import axios from "axios"

import { QuizApi } from "../rules/quiz"
import { AnswerOptions, Question, Quiz } from "../models/quiz"
import { Category, QuizSettings } from "../models/settings"

export type OpenTriviaDifficulty = 'easy' | 'medium' | 'hard'

export enum OpenTriviaCategory {
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

function mapCategory(model: Category): OpenTriviaCategory {
    const categoryMap: Record<number, OpenTriviaCategory> = {
        [Category.General]: OpenTriviaCategory.General,
        [Category.Books]: OpenTriviaCategory.Books,
        [Category.Film]: OpenTriviaCategory.Film,
        [Category.Music]: OpenTriviaCategory.Music,
        [Category.Television]: OpenTriviaCategory.Television,
        [Category.VideoGames]: OpenTriviaCategory.VideoGames,
        [Category.BoardGames]: OpenTriviaCategory.BoardGames,
        [Category.ScienceAndNature]: OpenTriviaCategory.ScienceAndNature,
        [Category.Computers]: OpenTriviaCategory.Computers,
        [Category.Mathematics]: OpenTriviaCategory.Mathematics,
        [Category.Mythology]: OpenTriviaCategory.Mythology,
        [Category.Sports]: OpenTriviaCategory.Sports,
        [Category.Geography]: OpenTriviaCategory.Geography,
        [Category.History]: OpenTriviaCategory.History,
        [Category.Politics]: OpenTriviaCategory.Politics,
        [Category.Art]: OpenTriviaCategory.Art,
        [Category.Celebrities]: OpenTriviaCategory.Celebrities,
        [Category.Animals]: OpenTriviaCategory.Animals,
        [Category.Vehicles]: OpenTriviaCategory.Vehicles,
        [Category.Comics]: OpenTriviaCategory.Comics,
        [Category.Gadgets]: OpenTriviaCategory.Gadgets,
        [Category.JapaneseCulture]: OpenTriviaCategory.JapaneseCulture,
        [Category.Cartoon]: OpenTriviaCategory.Cartoon,
    }

    return categoryMap[model] ?? OpenTriviaCategory.General
}

export type OpenTriviaOptions = {
    amount: number
    category: OpenTriviaCategory
    difficulty: OpenTriviaDifficulty
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
    readonly options: OpenTriviaOptions

    static from(settings: QuizSettings): OpenTriviaApi {
        let options: OpenTriviaOptions = {
            amount: settings.questions.count,
            category: mapCategory(settings.category),
            difficulty: settings.difficulty
        }
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


    private constructor(options: OpenTriviaOptions) {
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

    private urlFrom(options: OpenTriviaOptions): string {
        const params = new URLSearchParams()
        params.set('amount', String(options.amount))
        params.set('category', String(options.category.valueOf()))
        params.set('dificulty', options.difficulty)
        return `${this.url}?${params}`
    }

}

