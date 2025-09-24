import { describe, it, expect, beforeEach } from 'vitest'
import { shuffle, AnswerOptions, Question, Quiz, QuizResult } from './quiz'
import { QuizSettings, Category, QuestionCount } from './settings'

describe('shuffle function', () => {
  it('should return an array with the same length', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect(result).toHaveLength(input.length)
  })

  it('should contain all original elements', () => {
    const input = ['a', 'b', 'c', 'd']
    const result = shuffle(input)
    expect(result.sort()).toEqual(input.sort())
  })

  it('should not modify the original array', () => {
    const input = [1, 2, 3]
    const original = [...input]
    shuffle(input)
    expect(input).toEqual(original)
  })

  it('should handle empty array', () => {
    const result = shuffle([])
    expect(result).toEqual([])
  })

  it('should handle single element array', () => {
    const input = ['single']
    const result = shuffle(input)
    expect(result).toEqual(['single'])
  })
})

describe('AnswerOptions', () => {
    let answerOptions: AnswerOptions

    beforeEach(() => {
        answerOptions = AnswerOptions.from({
        correct: 'Correct Answer',
        incorrects: ['Wrong 1', 'Wrong 2', 'Wrong 3']
        })
    })

    it('should include all options', () => {
        expect(answerOptions.options).toContain('Correct Answer')
        expect(answerOptions.options).toContain('Wrong 1')
        expect(answerOptions.options).toContain('Wrong 2')
        expect(answerOptions.options).toContain('Wrong 3')
    })

    it('should have correct length', () => {
        expect(answerOptions.length).toBe(4)
    })

    it('should return correct answer', () => {
        expect(answerOptions.correct).toBe('Correct Answer')
    })

    it('should handle empty incorrect answers', () => {
        const options = AnswerOptions.from({
        correct: 'Only Answer',
        incorrects: []
        })
        expect(options.length).toBe(1)
        expect(options.correct).toBe('Only Answer')
        expect(options.options[0]).toBe('Only Answer')
    })

    it('should shuffle options (statistical test)', () => {
        const positions: number[] = []
        for (let i = 0; i < 100; i++) {
            const options = AnswerOptions.from({
                correct: 'Correct',
                incorrects: ['A', 'B', 'C']
            })
            const correctIndex = options.options.indexOf('Correct')
            positions.push(correctIndex)
        }
        
        const uniquePositions = new Set(positions)
        expect(uniquePositions.size).toBeGreaterThan(1)
    })

    it('should create with Data class methods', () => {
        const options1 = AnswerOptions.from({
            correct: 'Answer',
            incorrects: ['Wrong1', 'Wrong2']
        })
        const options2 = AnswerOptions.from({
            correct: 'Answer',
            incorrects: ['Wrong1', 'Wrong2']
        })
        
        // Should have same correct answer and length
        expect(options1.correct).toBe(options2.correct)
        expect(options1.length).toBe(options2.length)
    })
})

describe('Question', () => {
    let question: Question

    beforeEach(() => {
        question = Question.from({
            question: 'What is 2 + 2?',
            answer: '4',
            others: ['3', '5', '6']
        })
    })

    it('should create a question with correct properties', () => {
        expect(question.question).toBe('What is 2 + 2?')
        expect(question.isCorrect('4')).toBeTruthy()
        expect(question.options.length).toBe(4)
    })

    it('should correctly identify correct answers', () => {
        expect(question.isCorrect('4')).toBe(true)
    })

    it('should correctly identify incorrect answers', () => {
        expect(question.isCorrect('3')).toBe(false)
        expect(question.isCorrect('5')).toBe(false)
        expect(question.isCorrect('6')).toBe(false)
    })

    it('should handle case-sensitive comparisons', () => {
        const caseQuestion = Question.from({
            question: 'What is the capital of France?',
            answer: 'Paris',
            others: ['London', 'Berlin', 'Madrid']
        })
    
        expect(caseQuestion.isCorrect('Paris')).toBe(true)
        expect(caseQuestion.isCorrect('paris')).toBe(false)
        expect(caseQuestion.isCorrect('PARIS')).toBe(false)
    })

    it('should return false for non-existent choices', () => {
        expect(question.isCorrect('nonexistent')).toBe(false)
        expect(question.isCorrect('99')).toBe(false)
        expect(question.isCorrect('')).toBe(false)
    })

    it('should access options as a string[]', () => {
        expect(question.options).toBeDefined()
        expect(question.options.length).toBe(4)
        expect(question.options).toContain('4')
        expect(question.options).toContain('3')
        expect(question.options).toContain('5')
        expect(question.options).toContain('6')
    })

    it('should work with single true option', () => {
        const question = Question.true({
            question: 'Is the sky blue?',
        })

        expect(question.isCorrect('True')).toBe(true)
        expect(question.isCorrect('False')).toBe(false)
    
        expect(question.isTrue()).toBe(true)
        expect(question.isFalse()).toBe(false)
    
        expect(question.options.length).toBe(2)
    })
  
    it('should work with single false option questions)', () => {
        const polemicQuestion = Question.false({
            question: 'Is Python better than Ruby?',
        })

        expect(polemicQuestion.isCorrect('False')).toBe(true)
        expect(polemicQuestion.isCorrect('True')).toBe(false)
        
        expect(polemicQuestion.isFalse()).toBe(true)
        expect(polemicQuestion.isTrue()).toBe(false)

        expect(polemicQuestion.options.length).toBe(2)
    })
})

describe('Quiz', () => {
    let quiz: Quiz

    beforeEach(() => {
        const questions = [          
            Question.from({
                question: 'What is 2 + 2?',
                answer: '4',
                others: ['3', '5', '6']
            }),
            Question.from({
                question: 'What is the capital of France?',
                answer: 'Paris',
                others: ['London', 'Berlin', 'Madrid']
            }),
            Question.from({
                question: 'What color is the sky?',
                answer: 'Blue',
                others: ['Red', 'Green', 'Refactor']
            }),
        ]

        quiz = Quiz.create({
            score: 0,
            step: 1,
            level: 'easy',
            category: Category.General,
            questions
        })
    })

    it('should create a quiz with correct initial values', () => {
        expect(quiz.score).toBe(0)
        expect(quiz.step).toBe(1)
        expect(quiz.questions).toHaveLength(3)
        expect(quiz.level).toBe('easy')
        expect(quiz.category).toBe(Category.General)
    })

    it('steps should be equal to the amount of questions', () => {
        expect(quiz.steps).toBe(3)
    })

    it('should return current question', () => {
        expect(quiz.current).toBe(quiz.questions[0])
        
        const nextQuestion = quiz.guess("") as Quiz
        expect(nextQuestion.current).toBe(quiz.questions[1])
    })

    it('should handle correct guess', () => {
        const result = quiz.guess("4") as Quiz
        
        expect(result.score).toBe(1)
        expect(result.step).toBe(2)
        expect(result).toBeInstanceOf(Quiz)
    })

    it('should handle incorrect guess', () => {
        const result = quiz.guess("3") as Quiz
        
        expect(result.score).toBe(0)
        expect(result.step).toBe(2)
        expect(result).toBeInstanceOf(Quiz)
    })

    it('should return QuizResult when all questions are answered', () => {
        const step1 = quiz.copy()

        const step2 = step1.guess("4") as Quiz
        const step3 = step2.guess("Paris") as Quiz
        const result = step3.guess("Blue") as QuizResult

        expect(result).toBeInstanceOf(QuizResult)
        expect(result).toHaveProperty('score')
        expect(result).toHaveProperty('total')
        expect((result as any).score).toBe(3)
        expect((result as any).total).toBe(3)
    })

    it('should convert to QuizResult correctly', () => {
        const result = quiz.toResult()
        expect(result).toHaveProperty('score')
        expect(result).toHaveProperty('total')
        expect((result as any).score).toBe(0)
        expect((result as any).total).toBe(3)
    })
})

describe('Quiz integration tests', () => {
    it('should handle a complete quiz flow', () => {
        const questions = [
            Question.from({
                question: "What is H2O?",
                answer: "Water",
                others: ['Oxygen', 'Hydrogen', 'Carbon']
            }),
            Question.from({
                question: "How many legs does a spider have?",
                answer: "8",
                others: ['6', '10', '12']
            })
        ]

        const quiz = Quiz.from({
            level: "medium",
            category: Category.ScienceAndNature,
            questions
        })

        // Answer first question correctly
        const step2 = quiz.guess("Water") as Quiz
        expect(step2.score).toBe(1)
        expect(step2.step).toBe(2)

        // Answer second question incorrectly
        const result = step2.guess("10")

        expect(result).toBeInstanceOf(QuizResult)
        expect((result as any).score).toBe(1)
        expect((result as any).total).toBe(2)
    })
})


describe("QuizResult", () => {
    it('should create with default values', () => {
        const result = QuizResult.create({})
        expect(result.score).toBe(0)
        expect(result.total).toBe(1)
    })

    it('should create with provided values', () => {
        const result = QuizResult.is({ score: 5, of: 10 })
        expect(result.score).toBe(5)
        expect(result.total).toBe(10)
    })

    it('should calculate ratio correctly', () => {
        const result = QuizResult.is({ score: 3, of: 5 })
        expect(result.ratio).toBeCloseTo(0.6)
    })

})