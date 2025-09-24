import assert from "assert"

import { Data } from "dataclass"

export type QuizSettings = {
    questions: QuestionCount
    category: Category
    difficulty: Difficulty
}

export type Difficulty = "easy" | "medium" | "hard"

export enum Category {
    General,
    Books,
    Film,
    Music,
    Television,
    VideoGames,
    BoardGames,
    ScienceAndNature,
    Computers,
    Mathematics,
    Mythology,
    Sports,
    Geography,
    History,
    Politics,
    Art,
    Celebrities,
    Animals,
    Vehicles,
    Comics,
    Gadgets,
    JapaneseCulture,
    Cartoon,
}

export class QuestionCount extends Data {
    count: number = 0

    static from(count: number): QuestionCount {
        assert(count > 0, "The amount of questions must be positive.")
        return this.create({ count })
    }
}
