// Quiz.tsx
import { useState } from "react";
import { QuizQuestion } from "./QuizQuestion";
import { Question } from "./questions";

interface QuizProps {
    questions: Question[];
}

interface QuestionState {
    selectedAnswer: string | null;
    hasAnswered: boolean;
    isCorrect: boolean | null;
}

export function Quiz({ questions }: QuizProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [questionStates, setQuestionStates] = useState<QuestionState[]>(
        questions.map(() => ({
            selectedAnswer: null,
            hasAnswered: false,
            isCorrect: null
        }))
    );

    const currentQuestion = questions[currentQuestionIndex];
    const currentQuestionState = questionStates[currentQuestionIndex];

    const handleAnswer = (choice: string) => {
        const isCorrect = choice === currentQuestion.answer;
        
        const newQuestionStates = [...questionStates];
        newQuestionStates[currentQuestionIndex] = {
            selectedAnswer: choice,
            hasAnswered: true,
            isCorrect
        };
        
        setQuestionStates(newQuestionStates);
        
        // Update score by recalculating based on all answered questions
        const newScore = newQuestionStates.reduce(
            (total, state) => (state.isCorrect ? total + 1 : total),
            0
        );
        setScore(newScore);
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const finishQuiz = () => {
        setQuizCompleted(true);
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
        setQuestionStates(
            questions.map(() => ({
                selectedAnswer: null,
                hasAnswered: false,
                isCorrect: null
            }))
        );
    };

    if (quizCompleted) {
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">Quiz Completed!</h1>
                <p className="text-lg mb-6">
                    Your score: {score} out of {questions.length}
                </p>
                <button
                    onClick={restartQuiz}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Restart Quiz
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">MCQ Quiz</h1>
                <span className="text-gray-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </span>
            </div>
            
            <QuizQuestion
                question={currentQuestion}
                selectedAnswer={currentQuestionState.selectedAnswer}
                hasAnswered={currentQuestionState.hasAnswered}
                onAnswer={handleAnswer}
            />
            
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={goToPrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                
                <div className="text-gray-600">
                    Score: {score}
                </div>
                
                {currentQuestionIndex === questions.length - 1 ? (
                    <button
                        onClick={finishQuiz}
                        disabled={!currentQuestionState.hasAnswered}
                        className={`px-4 py-2 text-white rounded-md transition-colors ${
                            currentQuestionState.hasAnswered 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Finish Quiz
                    </button>
                ) : (
                    <button
                        onClick={goToNextQuestion}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}