// QuizQuestion.tsx
import { Question } from "./questions";

interface QuizQuestionProps {
    question: Question;
    selectedAnswer: string | null;
    hasAnswered: boolean;
    onAnswer: (choice: string) => void;
}

export function QuizQuestion({ question, selectedAnswer, hasAnswered, onAnswer }: QuizQuestionProps) {
    const handleAnswer = (choice: string) => {
        if (hasAnswered) return;
        onAnswer(choice);
    };

    return (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
            <div className="space-y-3">
                {question.choices.map((choice) => (
                    <button
                        key={choice}
                        onClick={() => handleAnswer(choice)}
                        className={`w-full text-left p-3 rounded-md border transition-colors
                            ${!hasAnswered ? 'hover:bg-gray-100 border-gray-300' : ''}
                            ${hasAnswered && choice === question.answer ? 'bg-green-100 border-green-500' : ''}
                            ${hasAnswered && selectedAnswer === choice && choice !== question.answer ? 'bg-red-100 border-red-500' : ''}
                            ${hasAnswered && selectedAnswer !== choice && choice !== question.answer ? 'opacity-70' : ''}
                        `}
                        disabled={hasAnswered}
                    >
                        {choice}
                    </button>
                ))}
            </div>
            {hasAnswered && selectedAnswer !== question.answer && (
                <div className="mt-3 text-green-600 font-medium">
                    Correct answer: {question.answer}
                </div>
            )}
        </div>
    );
}