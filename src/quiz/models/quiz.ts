import { Data } from "dataclass"

export function shuffle<T>(items: T[]): T[] {
    return items
        .map(value => ({ key: Math.random(), value }))
        .sort((a, b) => a.key - b.key)
        .map(({ value }) => value)
}


export class AnswerOptions {
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


export class Question extends Data {
    question: string = ""
    options: AnswerOptions = new AnswerOptions("", [])

    isCorrect(index: number): boolean {
        return index == this.options.correctIndex
    }
}


export class Quiz extends Data {
    score: number = 0
    step: number = 1
    questions: Question[] = []

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