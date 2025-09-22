import React, { useState } from 'react';
import { fetchQuestions } from '@/lib/api';
import { Question, Quiz, QuizSettings } from '@/types/quiz';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trophy, RotateCcw } from 'lucide-react';

const QuizApp: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    amount: 10,
    difficulty: 'medium',
    type: 'multiple'
  });

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchQuestions(quizSettings);
      
      if (data.response_code !== 0) {
        throw new Error('Failed to fetch questions. Please try again.');
      }

      setQuiz({
        questions: data.results,
        currentQuestionIndex: 0,
        score: 0,
        isCompleted: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const submitAnswer = () => {
    if (!quiz || selectedAnswer === null) return;

    const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    setShowResult(true);
    
    setTimeout(() => {
      const newScore = isCorrect ? quiz.score + 1 : quiz.score;
      const nextQuestionIndex = quiz.currentQuestionIndex + 1;
      const isCompleted = nextQuestionIndex >= quiz.questions.length;

      setQuiz({
        ...quiz,
        score: newScore,
        currentQuestionIndex: nextQuestionIndex,
        isCompleted
      });

      setSelectedAnswer(null);
      setShowResult(false);
    }, 2000);
  };

  const resetQuiz = () => {
    setQuiz(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setError(null);
  };

  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffleAnswers = (question: Question) => {
    const answers = [...question.incorrect_answers, question.correct_answer];
    return answers.sort(() => Math.random() - 0.5);
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-blue-600">Factastic</CardTitle>
              <CardDescription>Dynamic Quiz Platform powered by Open Trivia DB</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Questions</label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={quizSettings.amount}
                  onChange={(e) => setQuizSettings({ ...quizSettings, amount: parseInt(e.target.value) || 10 })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select 
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={quizSettings.difficulty}
                  onChange={(e) => setQuizSettings({ ...quizSettings, difficulty: e.target.value })}
                >
                  <option value="">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select 
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={quizSettings.type}
                  onChange={(e) => setQuizSettings({ ...quizSettings, type: e.target.value })}
                >
                  <option value="">Any Type</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="boolean">True / False</option>
                </select>
              </div>

              <Button 
                onClick={startQuiz} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Questions...
                  </>
                ) : (
                  'Start Quiz'
                )}
              </Button>

              {error && (
                <div className="text-red-600 text-sm text-center mt-2">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quiz.isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
        <div className="max-w-md mx-auto pt-16">
          <Card>
            <CardHeader className="text-center">
              <Trophy className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
              <CardDescription>
                You scored {quiz.score} out of {quiz.questions.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600">
                  {Math.round((quiz.score / quiz.questions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <Button onClick={resetQuiz} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  const answers = shuffleAnswers(currentQuestion);
  const progress = ((quiz.currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Question {quiz.currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span className="text-sm font-medium">Score: {quiz.score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardDescription className="text-xs uppercase font-medium text-blue-600">
              {currentQuestion.category} • {currentQuestion.difficulty}
            </CardDescription>
            <CardTitle className="text-xl leading-relaxed">
              {decodeHtml(currentQuestion.question)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {answers.map((answer, index) => (
              <Button
                key={index}
                variant={selectedAnswer === answer ? "default" : "outline"}
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswerSelect(answer)}
                disabled={showResult}
              >
                {decodeHtml(answer)}
              </Button>
            ))}

            {selectedAnswer && !showResult && (
              <Button onClick={submitAnswer} className="w-full mt-4">
                Submit Answer
              </Button>
            )}

            {showResult && (
              <div className="mt-4 p-4 rounded-lg bg-gray-50">
                <div className={`font-medium ${selectedAnswer === currentQuestion.correct_answer ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedAnswer === currentQuestion.correct_answer ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                {selectedAnswer !== currentQuestion.correct_answer && (
                  <div className="text-sm text-gray-600 mt-1">
                    Correct answer: {decodeHtml(currentQuestion.correct_answer)}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizApp;