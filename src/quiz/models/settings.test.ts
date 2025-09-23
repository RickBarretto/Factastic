import { describe, it, expect } from 'vitest'
import { QuestionCount, Category } from './settings'

describe('QuestionCount', () => {
    it('should create with valid positive count', () => {
        const count = QuestionCount.from(5)
        expect(count.count).toBe(5)
    })

    it('should create with count of 1', () => {
        const count = QuestionCount.from(1)
        expect(count.count).toBe(1)
    })

    it('should throw error for zero count', () => {
        expect(() => QuestionCount.from(0)).toThrow('The amount of questions must be positive.')
    })

    it('should throw error for negative count', () => {
        expect(() => QuestionCount.from(-1)).toThrow('The amount of questions must be positive.')
        expect(() => QuestionCount.from(-10)).toThrow('The amount of questions must be positive.')
    })

    it('should handle large numbers', () => {
        const count = QuestionCount.from(1000)
        expect(count.count).toBe(1000)
    })

    it('should create using QuestionCount.create directly', () => {
        const count = QuestionCount.create({ count: 10 })
        expect(count.count).toBe(10)
    })
})

describe('Category enum', () => {
    it('should have all expected categories', () => {
        expect(Category.General).toBeDefined()
        expect(Category.Books).toBeDefined()
        expect(Category.Film).toBeDefined()
        expect(Category.Music).toBeDefined()
        expect(Category.Television).toBeDefined()
        expect(Category.VideoGames).toBeDefined()
        expect(Category.BoardGames).toBeDefined()
        expect(Category.ScienceAndNature).toBeDefined()
        expect(Category.Computers).toBeDefined()
        expect(Category.Mathematics).toBeDefined()
        expect(Category.Mythology).toBeDefined()
        expect(Category.Sports).toBeDefined()
        expect(Category.Geography).toBeDefined()
        expect(Category.History).toBeDefined()
        expect(Category.Politics).toBeDefined()
        expect(Category.Art).toBeDefined()
        expect(Category.Celebrities).toBeDefined()
        expect(Category.Animals).toBeDefined()
        expect(Category.Vehicles).toBeDefined()
        expect(Category.Comics).toBeDefined()
        expect(Category.Gadgets).toBeDefined()
        expect(Category.JapaneseCulture).toBeDefined()
        expect(Category.Cartoon).toBeDefined()
    })

    it('should have numeric values starting from 0', () => {
        expect(Category.General).toBe(0)
        expect(Category.Books).toBe(1)
        expect(Category.Film).toBe(2)
    })

    it('should allow accessing categories by string key', () => {
        expect(Category['General']).toBe(0)
        expect(Category['Books']).toBe(1)
        expect(Category['ScienceAndNature']).toBeDefined()
    })
})

describe('QuizSettings type', () => {
    it('should accept valid difficulty values', () => {
        const validDifficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard']
        
        validDifficulties.forEach(difficulty => {
        const settings = {
            questions: QuestionCount.from(10),
            category: Category.General,
            difficulty
        }
        expect(settings.difficulty).toBe(difficulty)
        })
    })

    it('should create complete settings object', () => {
        const settings = {
        questions: QuestionCount.from(15),
        category: Category.ScienceAndNature,
        difficulty: 'hard' as const
        }

        expect(settings.questions.count).toBe(15)
        expect(settings.category).toBe(Category.ScienceAndNature)
        expect(settings.difficulty).toBe('hard')
    })
})