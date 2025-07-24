import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const INFO_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
const NAV_LEFT = 'R52:6';
const NAV_RIGHT = 'R52:3';
const OK = 'R52:7';
const PAUSE = 'RS5:9';
const RESUME = 'RS5:12';

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_index: number;
}

type AnswersMap = Record<string, (number | null)[]>;

const RemoteQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [answeredRemotes, setAnsweredRemotes] = useState<Set<string>>(new Set());
  const [lastEventId, setLastEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isPausedRef = useRef(false);

  const paperId = location.state?.paperId;

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!paperId) {
      setLoading(false);
      setQuestions([]);
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/questions/?paper_id=${paperId}`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();

        const mapped = data.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
          correct_index: q.correct_index,
        }));

        setQuestions(mapped);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [paperId]);

  const nextCalledRef = useRef(false);

const goToNextQuestion = () => {
  if (nextCalledRef.current || quizEnded) return;
  nextCalledRef.current = true;

  setCurrentIndex(prev => {
    if (prev < questions.length - 1) {
      // Moving to next question
      setAnsweredRemotes(new Set());
      setTimeLeft(30);

      // Reset the lock after state update
      setTimeout(() => {
        nextCalledRef.current = false;
      }, 100);

      return prev + 1;
    } else {
      // Quiz is ending - this is the last question
      if (!quizEnded) {
        setQuizEnded(true);

        // Submit answers immediately
        fetch('http://127.0.0.1:8000/api/end-test/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answers),
        })
          .then(res => {
            if (res.ok) {
              navigate('/test-ended');
            } else {
              res.text().then(txt => {
                console.error('Auto-submit failed:', txt);
              });
            }
          })
          .catch(err => {
            console.error('Submit error:', err);
            // Reset flag on error to allow retry
            nextCalledRef.current = false;
            setQuizEnded(false);
          });
      }
      return prev;
    }
  });
};

  useEffect(() => {
    if (loading || !questions.length || quizEnded) return;

    const timer = setInterval(() => {
      if (!isPausedRef.current && !quizEnded) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            goToNextQuestion();
            return 30;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, currentIndex, questions.length]);

  useEffect(() => {
    if (loading || !questions.length) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/key-events/latest/');
        if (!res.ok) return;

        const evt = await res.json();
        if (evt.id === lastEventId) return;

        setLastEventId(evt.id);

        const { key_id, info } = evt;
        if (!key_id || !info) return;

        if (info === PAUSE) {
          setIsPaused(true);
          return;
        }

        if (info === RESUME) {
          setIsPaused(false);
          return;
        }

        if (info in INFO_TO_INDEX) {
          setAnswers(prev => {
            const next = { ...prev };
            if (!next[key_id]) next[key_id] = Array(questions.length).fill(null);
            if (next[key_id][currentIndex] === null) {
              next[key_id][currentIndex] = INFO_TO_INDEX[info];
              setAnsweredRemotes(prevSet => new Set(prevSet).add(key_id));
            }
            return next;
          });
        } else if (info === NAV_LEFT) {
          setCurrentIndex(i => Math.max(0, i - 1));
          setAnsweredRemotes(new Set());
          setTimeLeft(30);
        } else if (info === NAV_RIGHT) {
          if (currentIndex < questions.length - 1) {
            goToNextQuestion();
          }
        } else if (info === OK && currentIndex === questions.length - 1 && !quizEnded) {
          goToNextQuestion();
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [questions, currentIndex, answers, lastEventId, loading, navigate]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading Quiz...</div>
          <div className="text-slate-400 text-sm mt-2">Preparing your questions</div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-red-400 text-2xl">!</div>
          </div>
          <div className="text-white text-xl font-semibold">No Questions Found</div>
          <div className="text-slate-400 text-sm mt-2">Please check your quiz configuration</div>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const timeProgress = (timeLeft / 30) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">Q</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Group Quiz</h1>
                <div className="text-sm text-slate-300">Real-time Assessment</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-300 mb-1">Question Progress</div>
              <div className="text-xl font-bold text-white">
                {currentIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Timer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-white font-semibold">
                {isPaused ? 'Quiz Paused' : `${timeLeft}s remaining`}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-300 text-sm">
                {answeredRemotes.size} participant{answeredRemotes.size !== 1 ? 's' : ''} answered
              </span>
            </div>
          </div>
          
          {/* Timer Progress */}
          {!isPaused && (
            <div className="w-full bg-white/20 rounded-full h-1 mt-2">
              <div 
                className={`h-1 rounded-full transition-all duration-1000 ${
                  timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${timeProgress}%` }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {/* Question */}
          <div className="mb-8">
            <div className="text-sm text-slate-300 mb-2">Question {currentIndex + 1}</div>
            <h2 className="text-2xl font-semibold text-white leading-relaxed">
              {q.question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="grid gap-4">
            {q.options.map((opt, i) => (
              <div
                key={i}
                className="group relative bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-xl p-6 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-600/20 group-hover:from-blue-500/30 group-hover:to-purple-600/30 rounded-lg flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <span className="text-white font-bold text-lg">
                      {String.fromCharCode(65 + i)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-lg font-medium group-hover:text-blue-200 transition-colors duration-300">
                      {opt}
                    </div>
                  </div>
                </div>
                
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/5 group-hover:to-purple-600/5 rounded-xl transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Remote controlled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Group quiz mode</span>
                </div>
              </div>
              
              <div className="text-slate-400">
                Quiz ID: {paperId || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Timer */}
      <div className="fixed top-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{timeLeft}</div>
          <div className="text-xs text-slate-300">seconds</div>
        </div>
      </div>
    </div>
  );
};

export default RemoteQuiz;