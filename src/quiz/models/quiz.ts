import { assert } from "console"

import { Data } from "dataclass"

import { Category, Difficulty } from "./settings"

export function shuffle<T>(items: T[]): T[] {
    return items
        .map(value => ({ key: Math.random(), value }))
        .sort((a, b) => a.key - b.key)
        .map(({ value }) => value)
}

export class AnswerOptions extends Data {
    _options: string[] | null = null
    _correctIndex: number | null = null

    static from({
        correct,
        incorrects,
    }: {
        correct: string
        incorrects: string[]
    }): AnswerOptions {
        const options = shuffle([correct, ...incorrects])
        return AnswerOptions.create({
            _options: options,
            _correctIndex: options.indexOf(correct),
        })
    }

    get options(): string[] {
        assert(this._options != null, "Options is mandatory")
        return this._options!
    }

    get correct(): string {
        return this.options[this._correctIndex!]
    }

    get length(): number {
        return this.options.length
    }
}

export class Question extends Data {
    question: string = ""
    _options: AnswerOptions = AnswerOptions.from({
        correct: "",
        incorrects: [],
    })

    static from({
        question,
        answer,
        others,
    }: {
        question: string
        answer: string
        others: string[]
    }): Question {
        return Question.create({
            question,
            _options: AnswerOptions.from({
                correct: answer,
                incorrects: others,
            }),
        })
    }

    static true({ question }: { question: string }): Question {
        return Question.from({
            question,
            answer: "True",
            others: ["False"],
        })
    }

    static false({ question }: { question: string }): Question {
        return Question.from({
            question,
            answer: "False",
            others: ["True"],
        })
    }

    get options(): string[] {
        return this._options._options!
    }

    isCorrect(choice: string): boolean {
        return this._options.correct == choice
    }

    isTrue(): boolean {
        return this.isCorrect("True")
    }

    isFalse(): boolean {
        return this.isCorrect("False")
    }
}

export class Quiz extends Data {
    score: number = 0
    step: number = 1
    level: Difficulty = "easy"
    category: Category = Category.General
    questions: Question[] = []

    static from({
        level,
        category,
        questions,
    }: {
        level: Difficulty
        category: Category
        questions: Question[]
    }): Quiz {
        return Quiz.create({
            questions,
            level,
            category,
        })
    }

    get steps(): number {
        return this.questions.length
    }

    get current(): Question {
        return this.questions[this.step - 1]
    }

    guess(option: string): Quiz | QuizResult {
        const step: number = this.step + 1
        const score: number = this.current.isCorrect(option)
            ? this.score + 1
            : this.score

        const updated = this.copy({ step, score } as any)
        return step > this.steps ? updated.toResult() : updated
    }

    toResult(): QuizResult {
        const score = this.score
        const total = this.steps
        return QuizResult.is({ score, of: total })
    }
}

export class QuizResult extends Data {
    score: number = 0
    total: number = 1

    static is({ score, of }: { score: number; of: number }): QuizResult {
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
