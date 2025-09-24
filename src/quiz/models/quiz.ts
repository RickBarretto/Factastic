import { assert } from "console"

import { Data } from "dataclass"

import { QuizSettings } from "./settings"

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
    settings: QuizSettings

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

export class QuizResult extends Data {
    score: number = 0
    total: number = 1

    static is({ score, of }: {score: number, of: number}): QuizResult {
        const total = of

        assert(score >= 0, "Score must be positive")
        assert(total >= 0, "Total must be positive")
        assert(total >= 1, "At least score 1 should be possibe")
        assert(total >= score, "User should not score more than the max")

        return QuizResult.create({ score, total })
    }

    get isPrefect(): boolean {
        return this.score == this.total
    }

    get isGood(): boolean {
        return this.ratio >= 0.7
    }

    get ratio(): number {
        return this.score / this.total
    }

}