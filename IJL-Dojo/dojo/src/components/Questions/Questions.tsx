import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useSearchParams } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string; // not displayed
  test: number;
}

type AnswerMap = {
  [questionId: number]: string; // Stores selected answer (e.g., 'A', 'B', etc.)
};

const QuestionsList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<AnswerMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  // const testId = Number(searchParams.get("testId"));



const testId = 7
  useEffect(() => {
    axios
      .get<any[]>(`http://127.0.0.1:8000/questions/?test_id=${testId}`)
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
        console.log(res.data)
      })
      .catch((err) => {
        console.error('Failed to fetch questions:', err);
        setLoading(false);
      });
  }, []);

  const handleAnswerSelect = (questionId: number, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const operator = useSelector((state: RootState) => state.operatorLoginData);
  const handleSubmit = () => {
    const payload = {
      test_id: testId,
      operator_id: operator.employeeCode, // This must match Django's expected key
      answers: Object.entries(selectedAnswers).map(([questionId, selected_option]) => ({
        question_id: Number(questionId),
        selected_option,
      })),
    };
    setSubmitting(true);

    axios
      .post('http://127.0.0.1:8000/operator/submit-test/', payload)
      .then((response) => {
        alert('Test submitted successfully!');
        console.log('Submission response:', response.data);
        setSubmitting(false);
      })
      .catch((error) => {
        alert('Failed to submit test.');
        console.error('Submit error:', error);
        setSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold border-b-4 border-indigo-600 pb-2 mb-6">Questions</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-center text-gray-500">No questions found.</p>
        ) : (
          <>
            <div className="space-y-6">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="p-5 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <p className="text-lg font-medium text-gray-800 mb-3">{question.question}</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                      const text = question[`option_${opt.toLowerCase()}` as keyof Question];
                      if (!text) return null;

                      return (
                        <label
                          key={opt}
                          className={`flex items-center space-x-2 px-2 py-2 rounded cursor-pointer transition ${selectedAnswers[question.id] === opt
                              ? 'bg-indigo-100'
                              : 'hover:bg-gray-100'
                            }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={opt}
                            checked={selectedAnswers[question.id] === opt}
                            onChange={() => handleAnswerSelect(question.id, opt)}
                            className="form-radio text-indigo-600"
                          />
                          <span>{opt}. {text}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleSubmit}
                disabled={
                  Object.keys(selectedAnswers).length !== questions.length || submitting
                }
                className={`px-6 py-3 text-white font-semibold rounded ${submitting || Object.keys(selectedAnswers).length !== questions.length
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionsList;
