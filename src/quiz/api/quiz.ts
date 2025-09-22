import axios from "axios"

type Difficulty = 'easy' | 'medium' | 'hard'

enum Category {
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

type Options = {
    amount: number
    category: Category
    difficulty: Difficulty
}


// -------- API --------

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

const resp = await triviaFrom({
    amount: 10,
    category: Category.BoardGames,
    difficulty: 'hard'
})

console.log(resp.response_code == OpenTriviaCode.Success)
console.log(resp.results[0])


