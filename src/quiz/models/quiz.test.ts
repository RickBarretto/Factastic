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
    answerOptions = new AnswerOptions('Correct Answer', ['Wrong 1', 'Wrong 2', 'Wrong 3'])
  })

  it('should create options with correct answer included', () => {
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

  it('should have valid correctIndex', () => {
    expect(answerOptions.correctIndex).toBeGreaterThanOrEqual(0)
    expect(answerOptions.correctIndex).toBeLessThan(4)
    expect(answerOptions.options[answerOptions.correctIndex]).toBe('Correct Answer')
  })

  it('should handle empty incorrect answers', () => {
    const options = new AnswerOptions('Only Answer', [])
    expect(options.length).toBe(1)
    expect(options.correct).toBe('Only Answer')
    expect(options.correctIndex).toBe(0)
  })

  it('should shuffle options (statistical test)', () => {
    // Run multiple times to check if shuffling occurs
    const positions: number[] = []
    for (let i = 0; i < 100; i++) {
      const options = new AnswerOptions('Correct', ['A', 'B', 'C'])
      positions.push(options.correctIndex)
    }
    
    // Should have some variation in positions (not always the same)
    const uniquePositions = new Set(positions)
    expect(uniquePositions.size).toBeGreaterThan(1)
  })
})

describe('Question', () => {
  let question: Question

  beforeEach(() => {
    question = Question.create({
      question: 'What is 2 + 2?',
      options: new AnswerOptions('4', ['3', '5', '6'])
    })
  })

  it('should create a question with correct properties', () => {
    expect(question.question).toBe('What is 2 + 2?')
    expect(question.options.correct).toBe('4')
  })

  it('should correctly identify correct answers', () => {
    const correctIndex = question.options.correctIndex
    expect(question.isCorrect(correctIndex)).toBe(true)
  })

  it('should correctly identify incorrect answers', () => {
    const correctIndex = question.options.correctIndex
    for (let i = 0; i < question.options.length; i++) {
      if (i !== correctIndex) {
        expect(question.isCorrect(i)).toBe(false)
      }
    }
  })

  it('should create with default values', () => {
    const defaultQuestion = Question.create({})
    expect(defaultQuestion.question).toBe('')
    expect(defaultQuestion.options.correct).toBe('')
  })
})

describe('Quiz', () => {
  let quiz: Quiz
  let settings: QuizSettings

  beforeEach(() => {
    settings = {
      questions: QuestionCount.from(3),
      category: Category.General,
      difficulty: 'easy'
    }

    const questions = [
      Question.create({
        question: 'What is 2 + 2?',
        options: new AnswerOptions('4', ['3', '5', '6'])
      }),
      Question.create({
        question: 'What is the capital of France?',
        options: new AnswerOptions('Paris', ['London', 'Berlin', 'Madrid'])
      }),
      Question.create({
        question: 'What color is the sky?',
        options: new AnswerOptions('Blue', ['Red', 'Green', 'Yellow'])
      })
    ]

    quiz = Quiz.create({
      score: 0,
      step: 1,
      questions,
      settings
    })
  })

  it('should create a quiz with correct initial values', () => {
    expect(quiz.score).toBe(0)
    expect(quiz.step).toBe(1)
    expect(quiz.questions).toHaveLength(3)
    expect(quiz.settings).toBe(settings)
  })

  it('should return correct steps count', () => {
    expect(quiz.steps).toBe(3)
  })

  it('should return current question', () => {
    expect(quiz.current).toBe(quiz.questions[0])
    
    const nextQuiz = quiz.guess(quiz.current.options.correctIndex) as Quiz
    expect(nextQuiz.current).toBe(quiz.questions[1])
  })

  it('should handle correct guess', () => {
    const correctIndex = quiz.current.options.correctIndex
    const result = quiz.guess(correctIndex) as Quiz
    
    expect(result.score).toBe(1)
    expect(result.step).toBe(2)
    expect(result).toBeInstanceOf(Quiz)
  })

  it('should handle incorrect guess', () => {
    const correctIndex = quiz.current.options.correctIndex
    const incorrectIndex = (correctIndex + 1) % quiz.current.options.length
    const result = quiz.guess(incorrectIndex) as Quiz
    
    expect(result.score).toBe(0)
    expect(result.step).toBe(2)
    expect(result).toBeInstanceOf(Quiz)
  })

  it('should return QuizResult when all questions are answered', () => {
    let currentQuiz = quiz
    
    // Answer first two questions correctly
    for (let i = 0; i < 2; i++) {
      const correctIndex = currentQuiz.current.options.correctIndex
      currentQuiz = currentQuiz.guess(correctIndex) as Quiz
    }
    
    // Answer last question correctly
    const correctIndex = currentQuiz.current.options.correctIndex
    const result = currentQuiz.guess(correctIndex)
    
    expect(result).not.toBeInstanceOf(Quiz)
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

  it('should handle quiz progression correctly', () => {
    let currentQuiz = quiz
    let questionsAnswered = 0
    
    while (currentQuiz instanceof Quiz && questionsAnswered < 10) { // Safety limit
      const correctIndex = currentQuiz.current.options.correctIndex
      const result = currentQuiz.guess(correctIndex)
      questionsAnswered++
      
      if (result instanceof Quiz) {
        currentQuiz = result
        expect(currentQuiz.step).toBe(questionsAnswered + 1)
        expect(currentQuiz.score).toBe(questionsAnswered)
      } else {
        // Should be QuizResult
        expect((result as any).score).toBe(questionsAnswered)
        expect((result as any).total).toBe(3)
        break
      }
    }
    
    expect(questionsAnswered).toBe(3)
  })

  it('should create with default values', () => {
    const defaultQuiz = Quiz.create({ settings })
    expect(defaultQuiz.score).toBe(0)
    expect(defaultQuiz.step).toBe(1)
    expect(defaultQuiz.questions).toEqual([])
  })

  it('should handle empty quiz', () => {
    const emptyQuiz = Quiz.create({ 
      questions: [],
      settings
    })
    
    expect(emptyQuiz.steps).toBe(0)
    
    // Guessing on empty quiz should return result immediately
    const result = emptyQuiz.guess(0)
    expect(result).not.toBeInstanceOf(Quiz)
    expect((result as any).score).toBe(0)
    expect((result as any).total).toBe(0)
  })
})

describe('Quiz integration tests', () => {
  it('should handle a complete quiz flow', () => {
    const settings: QuizSettings = {
      questions: QuestionCount.from(2),
      category: Category.ScienceAndNature,
      difficulty: 'medium'
    }

    const questions = [
      Question.create({
        question: 'What is H2O?',
        options: new AnswerOptions('Water', ['Oxygen', 'Hydrogen', 'Carbon'])
      }),
      Question.create({
        question: 'How many legs does a spider have?',
        options: new AnswerOptions('8', ['6', '10', '12'])
      })
    ]

    let quiz = Quiz.create({
      questions,
      settings
    })

    // Answer first question correctly
    const firstCorrectIndex = quiz.current.options.correctIndex
    quiz = quiz.guess(firstCorrectIndex) as Quiz
    expect(quiz.score).toBe(1)
    expect(quiz.step).toBe(2)

    // Answer second question incorrectly
    const secondCorrectIndex = quiz.current.options.correctIndex
    const incorrectIndex = (secondCorrectIndex + 1) % quiz.current.options.length
    const result = quiz.guess(incorrectIndex)

    expect(result).not.toBeInstanceOf(Quiz)
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