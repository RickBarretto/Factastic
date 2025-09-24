import axios from "axios"

import { QuizApi } from "../rules/quiz"
import { Question as QuizQuestion } from "../models/quiz"
import { Quiz } from "../models/quiz"
import {
    Category as QuizCategory,
    Difficulty as QuizDifficulty,
    QuizSettings,
} from "../models/settings"

export type Difficulty = "easy" | "medium" | "hard"

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

function mapCategory(model: QuizCategory): Category {
    const categoryMap: Record<number, Category> = {
        [QuizCategory.General]: Category.General,
        [QuizCategory.Books]: Category.Books,
        [QuizCategory.Film]: Category.Film,
        [QuizCategory.Music]: Category.Music,
        [QuizCategory.Television]: Category.Television,
        [QuizCategory.VideoGames]: Category.VideoGames,
        [QuizCategory.BoardGames]: Category.BoardGames,
        [QuizCategory.ScienceAndNature]: Category.ScienceAndNature,
        [QuizCategory.Computers]: Category.Computers,
        [QuizCategory.Mathematics]: Category.Mathematics,
        [QuizCategory.Mythology]: Category.Mythology,
        [QuizCategory.Sports]: Category.Sports,
        [QuizCategory.Geography]: Category.Geography,
        [QuizCategory.History]: Category.History,
        [QuizCategory.Politics]: Category.Politics,
        [QuizCategory.Art]: Category.Art,
        [QuizCategory.Celebrities]: Category.Celebrities,
        [QuizCategory.Animals]: Category.Animals,
        [QuizCategory.Vehicles]: Category.Vehicles,
        [QuizCategory.Comics]: Category.Comics,
        [QuizCategory.Gadgets]: Category.Gadgets,
        [QuizCategory.JapaneseCulture]: Category.JapaneseCulture,
        [QuizCategory.Cartoon]: Category.Cartoon,
    }

    return categoryMap[model] ?? Category.General
}

function mapDifficulty(model: QuizDifficulty): Difficulty {
    return model
}

export type OpenTriviaOptions = {
    amount: number
    category: Category
    difficulty: Difficulty
}

// -------- Internal --------

enum StatuCode {
    Success = 0,
    ManyQuestions = 1,
    InvalidParameter = 2,
    SessionNotFound = 3,
    ResetSessionRequired = 4,
    RateLimit = 5,
}

type ApiQuiz = {
    type: "multiple" | "boolean"
    diffculty: "easy" | "medium" | "hard"
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

type Response = {
    response_code: StatuCode
    results: ApiQuiz[]
}

const httpOkStatus = 200

export class OpenTriviaApi implements QuizApi {
    readonly url: string = "https://opentdb.com/api.php"
    readonly options: OpenTriviaOptions

    static from(settings: QuizSettings): OpenTriviaApi {
        let options: OpenTriviaOptions = {
            amount: settings.questions.count,
            category: mapCategory(settings.category),
            difficulty: mapDifficulty(settings.difficulty),
        }
        return new this(options)
    }

    async intoQuiz(): Promise<Quiz> {
        const response = await this.fetch()
        const questions = response.results.map(result =>
            QuizQuestion.from({
                question: result.question,
                answer: result.correct_answer,
                others: result.incorrect_answers,
            })
        )
        return Quiz.create({ questions })
    }

    private constructor(options: OpenTriviaOptions) {
        this.options = options
    }

    private async fetch(): Promise<Response> {
        const url = this.urlFrom(this.options)
        const response = await axios.get(url)

        if (response.status != httpOkStatus) {
            throw new Error(`Failed to fetch OpenTDB : ${response.statusText}`)
        }

        return response.data as Response
    }

    private urlFrom(options: OpenTriviaOptions): string {
        const params = new URLSearchParams()
        params.set("amount", String(options.amount))
        params.set("category", String(options.category.valueOf()))
        params.set("dificulty", options.difficulty)
        return `${this.url}?${params}`
    }
}
