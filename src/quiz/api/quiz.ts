import axios from "axios"
import { Data } from "dataclass"

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


// -------- API --------


export function shuffle<T>(items: T[]): T[] {
    return items
        .map(value => ({ key: Math.random(), value }))
        .sort((a, b) => a.key - b.key)
        .map(({ value }) => value)
}


class AnswerOptions {
    readonly options: string[]
    readonly correctIndex: number

    constructor(correct: string, incorrects: string[]) {
        const options = shuffle([correct, ...incorrects])
        this.options = options
        this.correctIndex = options.indexOf(correct)
    }

    get correct(): string {
        return this.options[this.correctIndex]
    }

    get length(): number {
        return this.options.length
    }

}


class Question extends Data {
    question: string = ""
    options: AnswerOptions = new AnswerOptions("", [])

    static fromApi(result: OpenTriviaResult): Question {
        return Question.create({
            question: result.question,
            options: new AnswerOptions(
                result.correct_answer, 
                result.incorrect_answers
            )
        })
    }

    isCorrect(index: number): boolean {
        return index == this.options.correctIndex
    }
}


export class Quiz extends Data {
    score: number = 0
    step: number = 1
    questions: Question[] = []

    static async from(options: Options): Promise<Quiz> {
        const response = await triviaFrom(options)
        const questions = response.results.map(Question.fromApi)
        return Quiz.create({questions})
    }

    get steps(): number {
        return this.questions.length
    }

    get current(): Question {
        return this.questions[this.step - 1]
    }

    guess(option: number): Quiz | QuizResult {
        let step = this.step + 1
        let score = (this.current.isCorrect(option))?
            this.score + 1 : this.score

        if (step > this.steps) {
            return this.toResult()
        }

        return this.copy({step, score})
    }

    toResult(): QuizResult {
        return QuizResult.create({ 
            score: this.score, 
            total: this.steps 
        })
    }
}

class QuizResult extends Data {
    score: number
    total: number
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

function urlFrom(options: Options) {
    const params = new URLSearchParams()
    params.set('amount', String(options.amount))
    params.set('category', String(options.category.valueOf()))
    params.set('dificulty', options.difficulty)
    return `https://opentdb.com/api.php?${params}`
}


const httpOkStatus = 200

async function triviaFrom(options: Options): Promise<OpenTriviaResponse> {
    const url = urlFrom(options)
    const response = await axios.get(url)

    if (response.status != httpOkStatus) {
        throw new Error(`Failed to fetch OpenTDB : ${response.statusText}`)
    }

    return response.data as OpenTriviaResponse
}

// run with `deno run src/quiz/api/quiz.ts`

// console.log(
//     await Quiz.from({
//         amount: 10,
//         category: Category.Computers,
//         difficulty: 'medium'
//     })
// )


